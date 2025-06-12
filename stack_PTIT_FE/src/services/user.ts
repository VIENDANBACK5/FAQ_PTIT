import request from "umi-request";



export async function getUserQuestions(userId: number) {
  return request(`/api/users/${userId}/questions`, {
    method: "GET",
  });
}

export async function getUserAnswers(userId: number) {
  return request(`/api/users/${userId}/answers`, {
    method: "GET",
  });
}

export async function getUserTags(userId: number) {
  return request(`/api/users/${userId}/tags`, {
    method: "GET",
  });
}

export async function getUserActivities(userId: number) {
  return request(`/api/users/${userId}/activities`, {
    method: "GET",
  });
}

