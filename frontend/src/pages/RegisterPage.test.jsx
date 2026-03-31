import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import RegisterPage from "./RegisterPage";

const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
  });

const renderRegisterPage = () => {
  const store = createTestStore();

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    </Provider>,
  );
};

describe("RegisterPage", () => {
  it("renders the register page", () => {
    renderRegisterPage();

    expect(
      screen.getByRole("button", { name: /register/i }),
    ).toBeInTheDocument();
  });

  it("renders name, email, and password fields", () => {
    renderRegisterPage();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    const passwordInputs = screen.getAllByLabelText(/password/i);
    expect(passwordInputs.length).toBeGreaterThan(0);
  });

  it("renders link to login page", () => {
    renderRegisterPage();

    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
  });
});