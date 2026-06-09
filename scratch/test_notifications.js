const fetch = require('node-fetch');
const FormData = require('form-data');

const baseUrl = 'http://localhost:8000/api';

async function signup(email, userName, password, name) {
  const res = await fetch(`${baseUrl}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, userName, password, name })
  });
  return await res.json();
}

async function signin(email, password) {
  const res = await fetch(`${baseUrl}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const cookies = res.headers.get('set-cookie');
  const data = await res.json();
  return { cookies, user: data };
}

async function getPosts(cookies) {
  const res = await fetch(`${baseUrl}/post/getAll`, {
    method: 'GET',
    headers: { Cookie: cookies }
  });
  return await res.json();
}

async function likePost(postId, cookies) {
  const res = await fetch(`${baseUrl}/post/like/${postId}`, {
    method: 'GET',
    headers: { Cookie: cookies }
  });
  return await res.json();
}

async function getNotifications(cookies) {
  const res = await fetch(`${baseUrl}/notification/`, {
    method: 'GET',
    headers: { Cookie: cookies }
  });
  return await res.json();
}

(async () => {
  const email = 'testuser@example.com';
  const userName = 'testuser';
  const password = 'Password123';
  const name = 'Test User';

  // ensure user exists (ignore errors)
  await signup(email, userName, password, name).catch(() => {});
  const { cookies } = await signin(email, password);
  const posts = await getPosts(cookies);
  console.log('Posts count:', posts.length);
  if (posts.length > 0) {
    const postId = posts[0]._id;
    await likePost(postId, cookies);
    const notifs = await getNotifications(cookies);
    console.log('Notifications after like:', notifs);
  } else {
    console.log('No posts to like.');
  }
})();
