const postList = document.getElementById('postList');
const postContent = document.getElementById('postContent');
const commentList = document.getElementById('commentList');
const commentForm = document.getElementById('commentForm');
const commentInput = document.getElementById('commentInput');
const notificationIcon = document.getElementById('notificationIcon');
const notificationModal = document.getElementById('notificationModal');
const notificationBadge = document.getElementById('notificationBadge');
const notificationList = document.getElementById('notificationList');
const closeBtn = document.querySelector('.close');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');
const totalPostsSpan = document.getElementById('totalPosts');

let currentPostId;
let currentPage = 1;
let totalPosts = 0;
const postsPerPage = 10;

let notificationPage = 1;
const notificationPerPage = 10;

async function loadPosts(page = 1) {
  try {
    const [postsResponse, countResponse] = await Promise.all([
      fetch(`/api/posts?page=${page}&limit=${postsPerPage}`),
      fetch('/api/posts/count'),
    ]);

    if (!postsResponse.ok || !countResponse.ok)
      throw new Error('데이터 로딩 실패');

    const postsResult = await postsResponse.json();
    const countResult = await countResponse.json();

    const posts = postsResult.data;
    totalPosts = countResult.data.count;

    displayPosts(posts);
    updatePagination(totalPosts, page);
  } catch (error) {
    console.error('에러:', error);
    postList.innerHTML = '<div>게시글 로딩 실패</div>';
  }
}

function displayPosts(posts) {
  postList.innerHTML = posts
    .map(
      (post) => `
        <div class="post-item" data-id="${post.idx}">
            <span class="post-idx">${post.idx}</span>
            <span class="post-title">${post.title}</span>
            <span class="post-author">${post.authorName}</span>
            <span class="post-date">${new Date(post.createdAt).toLocaleString()}</span>
        </div>
    `,
    )
    .join('');
}

function updatePagination(totalPosts, currentPage) {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  currentPageSpan.textContent = currentPage;
  totalPagesSpan.textContent = totalPages;
  totalPostsSpan.textContent = `총 게시글: ${totalPosts}개 `;

  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
}

async function loadPostDetail(postId) {
  try {
    const response = await fetch(`/api/posts/${postId}`);
    if (!response.ok) throw new Error('게시글 상세 로딩 실패');
    const { data } = await response.json();
    displayPostDetail(data);
    loadComments(postId);
  } catch (error) {
    console.error('에러:', error);
    postContent.innerHTML = '게시글 상세 로딩 실패';
  }
}

function displayPostDetail(post) {
  postContent.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
    `;
}

async function loadComments(postId) {
  try {
    const response = await fetch(`/api/comments/${postId}`);
    if (!response.ok) throw new Error('댓글 로딩 실패');
    const { data } = await response.json();
    displayComments(data);
  } catch (error) {
    console.error('에러:', error);
    commentList.innerHTML = '<li>댓글 로딩 실패</li>';
  }
}

function displayComments(comments) {
  commentList.innerHTML = comments
    .map(
      (comment) => `
        <li>
            <span>작성자: ${comment.authorName}</span>
            <span>내용: ${comment.content}</span>
            <span>생성일: ${new Date(comment.createdAt).toLocaleString()}</span>
        </li>
    `,
    )
    .join('');
}

async function loadNotificationCount() {
  const response = await fetch('/api/notifications/count');
  if (!response.ok) throw new Error('알림 개수 로딩 실패');

  const { data } = await response.json();
  notificationBadge.textContent = data.count;
}

async function loadNotifications(page = 1) {
  try {
    const response = await fetch(
      `/api/notifications/all?page=${page}&limit=${notificationPerPage}`,
    );
    if (!response.ok) throw new Error('알림 로딩 실패');
    const result = await response.json();
    const notifications = result.data;
    displayNotifications(notifications);
  } catch (error) {
    console.error('에러:', error);
    notificationList.innerHTML = '<li>알림 로딩 실패</li>';
  }
}

function displayNotifications(notifications) {
  notificationList.innerHTML = notifications
    .map(
      (notification) => `
        <li>
            <span>${notification.entityType} 알림</span>
            <span>보낸 사람: ${notification.senderIdx}</span>
            <span>받은 시간: ${new Date(notification.createdAt).toLocaleString()}</span>
        </li>
    `,
    )
    .join('');
}

postList.addEventListener('click', (e) => {
  const postItem = e.target.closest('.post-item');
  if (postItem) {
    currentPostId = postItem.dataset.id;
    loadPostDetail(currentPostId);
  }
});

commentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const content = commentInput.value.trim();
  if (content && currentPostId) {
    try {
      const response = await fetch(`/api/posts/${currentPostId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('댓글 작성 실패');
      commentInput.value = '';
      loadComments(currentPostId);
    } catch (error) {
      console.error('에러:', error);
      alert('댓글 작성 실패');
    }
  }
});

function connectSSE() {
  const eventSource = new EventSource('/api/sse/subscribe');

  eventSource.onmessage = (event) => {
    const { data } = JSON.parse(event.data);
    console.log('새 알림:', data);
    const { authorName, content, entityType, senderIdx, createdAt } = data;

    const currentCount = parseInt(notificationBadge.textContent);
    notificationBadge.textContent = currentCount + 1;

    const li = document.createElement('li');
    // li.textContent = `${`[${entityType}]`};
    li.innerHTML = `<li>
        [새로운 알림]
        <span>${entityType} 알림</span>
        <span>보낸 사람: ${authorName}</span>
        <span>내용: ${content}</span>
        <span>
          받은 시간: ${new Date(createdAt).toLocaleString()}
        </span>
      </li>`;
    notificationList.insertBefore(li, notificationList.firstChild);
  };

  eventSource.onerror = (error) => {
    console.error('SSE 에러:', error);
    eventSource.close();
  };
}

notificationIcon.addEventListener('click', () => {
  notificationModal.style.display = 'block';
  loadNotifications();
});

closeBtn.addEventListener('click', () => {
  notificationModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target == notificationModal) {
    notificationModal.style.display = 'none';
  }
});

prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    loadPosts(currentPage);
  }
});

nextPageBtn.addEventListener('click', () => {
  currentPage++;
  loadPosts(currentPage);
});

const notiPrevBtn = document.createElement('button');
notiPrevBtn.textContent = '이전';
const notiNextBtn = document.createElement('button');
notiNextBtn.textContent = '다음';
notificationModal.querySelector('.modal-content').appendChild(notiPrevBtn);
notificationModal.querySelector('.modal-content').appendChild(notiNextBtn);

notiPrevBtn.addEventListener('click', () => {
  if (notificationPage > 1) {
    notificationPage--;
    loadNotifications(notificationPage);
  }
});

notiNextBtn.addEventListener('click', () => {
  notificationPage++;
  loadNotifications(notificationPage);
});

// 초기 로딩
loadPosts();
loadNotificationCount();
connectSSE();
