export const signUp = async (formData) => {
  try {
    const response = await fetch("/server/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.errors && data.errors.length > 0 ? data.errors.join(", ") : data.message;
      throw new Error(errorMessage || "Sign-up failed.");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Sign-up failed. Please try again later.");
  }
};

export const signIn = async (formData) => {
  try {
    const response = await fetch("/server/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.errors && data.errors.length > 0 ? data.errors.join(", ") : data.message;
      throw new Error(errorMessage || "Sign-in failed.");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Sign-in failed. Please try again later.");
  }
};


export const signOut = async () => {
  console.log("under signout api req..");
  try {
    const response = await fetch("/server/signout", {
      method: "POST",
    });

    const data = await response.json();
    console.log("authApi signOut data:",data);

    if (!response.ok) {
      const errorMessage = data.errors && data.errors.length > 0 ? data.errors.join(", ") : data.message;
      throw new Error(errorMessage || "Sign-out failed.");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Sign-out failed. Please try again later.");
  }
};
