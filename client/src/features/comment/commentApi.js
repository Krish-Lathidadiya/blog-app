export const createComment = async (formData) => {
  try {
    const response = await fetch("/server/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) {
      const errorMessage =
        data.errors?.length > 0 ? data.errors.join(", ") : data.message;
      throw new Error(errorMessage || "Comment creation failed.");
    }
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Comment creation failed. Please try again later."
    );
  }
};

export const getPostComments = async (postId) => {
  try {
    const response = await fetch(`/server/comment/${postId}`, {
      method: "GET",
    });
    const data = await response.json();
    if (!response.ok) {
      const errorMessage =
        data.errors?.length > 0 ? data.errors.join(", ") : data.message;
      throw new Error(errorMessage || "Fetching comments failed.");
    }
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Fetching comments failed. Please try again later."
    );
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await fetch(`/server/comment/${commentId}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      const errorMessage =
        data.errors?.length > 0 ? data.errors.join(", ") : data.message;
      throw new Error(errorMessage || "Comment deletion failed.");
    }
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Comment deletion failed. Please try again later."
    );
  }
};

export const likeComment = async (commentId) => {
  try {
    const response = await fetch(`/server/comment/${commentId}`, {
      method: "POST",
    });
    const data = await response.json();
    if (!response.ok) {
      const errorMessage =
        data.errors?.length > 0 ? data.errors.join(", ") : data.message;
      throw new Error(errorMessage || "Liking comment failed.");
    }
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Liking comment failed. Please try again later."
    );
  }
};

export const updateComment = async (commentId, content) => {
  try {
    const response = await fetch(`/server/comment/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content }),
    });
    const data = await response.json();
    if (!response.ok) {
      const errorMessage =
        data.errors?.length > 0 ? data.errors.join(", ") : data.message;
      throw new Error(errorMessage || "Comment update failed.");
    }
    return data;
  } catch (error) {
    throw new Error(
      error.message || "Comment update failed. Please try again later."
    );
  }
};

export const getAllComments = async (newFilter) => {
  let queryString = "";

  for (let key in newFilter) {
    if (Array.isArray(newFilter[key])) {
      newFilter[key].forEach((value) => {
        queryString += `${key}=${value}&`;
      });
    } else {
      queryString += `${key}=${newFilter[key]}&`;
    }
  }

  console.log("queryString: " + queryString);
  try {
    const response = await fetch(`/server/comment?${queryString}`, {
      method: "GET",
    });
    const data = await response.json();
    if (!response.ok) {
      const errorMessage =
        data.errors?.length > 0 ? data.errors.join(", ") : data.message;
      throw new Error(errorMessage || "Get Comment failed.");
    }
    return data;
  } catch (error) {
    throw new Error(
      error.message || "GEt Comment failed. Please try again later."
    );
  }
};
