export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`/server/user/${userId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors && data.errors.length > 0
          ? data.errors.join(", ")
          : data.message;
      throw new Error(errorMessage || "User deletion failed.");
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "User deletion failed. Please try again later."
    );
  }
};

export const updateUser = async (userId, formData) => {
  try {
    const response = await fetch(`/server/user/${userId}`, {
      method: "PATCH",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors && data.errors.length > 0
          ? data.errors.join(", ")
          : data.message;
      throw new Error(errorMessage || "User update failed.");
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "User update failed. Please try again later."
    );
  }
};

export const getUsers = async (newFilter) => {
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

  try {
    const response = await fetch(`/server/user?${queryString}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || "User fetch failed.";
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "User fetch failed. Please try again later."
    );
  }
};

export const getUser = async (userId) => {
  try {
    const response = await fetch(`/server/user/${userId}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors && data.errors.length > 0
          ? data.errors.join(", ")
          : data.message;
      throw new Error(errorMessage || "GET User failed.");
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || "Get User  failed. Please try again later."
    );
  }
};
