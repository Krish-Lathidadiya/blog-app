export const createPost = async (formData) => {
  try {
    const response = await fetch("/server/post/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors && data.errors.length > 0
          ? data.errors.join(", ")
          : data.message;
      throw new Error(errorMessage || "Post Creation failed.");
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "Post Creation failed. Please try again later."
    );
  }
};

export const deletePost = async (postId, userId) => {
  try {
    const response = await fetch(`/server/post/${postId}/${userId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors && data.errors.length > 0
          ? data.errors.join(", ")
          : data.message;
      throw new Error(errorMessage || "Post Deletion failed.");
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "Post Deletion failed. Please try again later."
    );
  }
};

export const getPosts = async (newFilter) => {
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
    const response = await fetch(`/server/posts?${queryString}`, {
      method: "GET",
    });

    const data = await response.json();
    // console.log("postApi getpost data: ", data);

    if (!response.ok) {
      const errorMessage =
        data.errors && data.errors.length > 0
          ? data.errors.join(", ")
          : data.message;
      throw new Error(errorMessage || "Post fetch failed.");
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "Post fetch failed. Please try again later."
    );
  }
};

export const updatePost = async (postId, userId,formData) => {
  try {
    const response = await fetch(`/server/post/${postId}/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors && data.errors.length > 0
          ? data.errors.join(", ")
          : data.message;
      throw new Error(errorMessage || "Post Updation failed.");
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "Post Updation failed. Please try again later."
    );
  }
};