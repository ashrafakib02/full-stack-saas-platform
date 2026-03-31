import authReducer, {
  setCredentials,
  logout,
} from "./authSlice";

describe("authSlice", () => {
  const initialState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
  };

  it("should return the initial state", () => {
    expect(authReducer(undefined, { type: "@@INIT" })).toEqual(
      expect.objectContaining({
        user: null,
      }),
    );
  });

  it("should handle setCredentials", () => {
    const payload = {
      user: {
        id: "user-1",
        name: "Ashraful",
        email: "ashraful@test.com",
      },
      accessToken: "test-access-token",
    };

    const state = authReducer(initialState, setCredentials(payload));

    expect(state.user).toEqual(payload.user);
    expect(state.accessToken).toBe(payload.accessToken);

    if ("isAuthenticated" in state) {
      expect(state.isAuthenticated).toBe(true);
    }
  });

  it("should handle logout", () => {
    const loggedInState = {
      user: {
        id: "user-1",
        name: "Ashraful",
        email: "ashraful@test.com",
      },
      accessToken: "test-access-token",
      isAuthenticated: true,
    };

    const state = authReducer(loggedInState, logout());

    expect(state.user).toBeNull();

    if ("accessToken" in state) {
      expect(state.accessToken).toBeNull();
    }

    if ("isAuthenticated" in state) {
      expect(state.isAuthenticated).toBe(false);
    }
  });
});