import '@testing-library/jest-dom';
import { render, screen, fireEvent, act } from "@testing-library/react";
import LettuceGame from "./page";

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("../../../lib/firebase", () => ({ db: {} }));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(() =>
    Promise.resolve({ data: () => ({ tomatoCompleted: false }) })
  ),
  updateDoc: jest.fn(),
  increment: jest.fn(),
}));
jest.mock("../../../context/AuthContext", () => ({
  useAuth: () => ({ user: null }),
}));
jest.mock("./grass.jpg", () => ({ src: "/grass.jpg" }));

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("LettuceGame", () => {

  // ── Info Modal ──────────────────────────────────────────────────────────────

  describe("Info modal", () => {
    it("shows the info modal on first load", () => {
      render(<LettuceGame />);
      expect(screen.getByText(/Hi! I'm Otto the Otter/i)).toBeInTheDocument();
    });

    it("closes the info modal when 'Let's Play!' is clicked", () => {
      render(<LettuceGame />);
      fireEvent.click(screen.getByText("Let's Play!"));
      expect(screen.queryByText(/Hi! I'm Otto the Otter/i)).not.toBeInTheDocument();
    });

    it("re-opens the info modal when the otter button is clicked", () => {
      render(<LettuceGame />);
      fireEvent.click(screen.getByText("Let's Play!"));
      fireEvent.click(screen.getByAltText("otter"));
      expect(screen.getByText(/Hi! I'm Otto the Otter/i)).toBeInTheDocument();
    });
  });

  // ── Active game ─────────────────────────────────────────────────────────────

  describe("Active game", () => {
    beforeEach(() => {
      render(<LettuceGame />);
      fireEvent.click(screen.getByText("Let's Play!"));
      fireEvent.click(screen.getByText("Start Game"));
    });

    it("hides the Start Game button once the game begins", () => {
      expect(screen.queryByText("Start Game")).not.toBeInTheDocument();
    });

    it("shows the timer once the game starts", () => {
      expect(screen.getByText(/Time Left: 30/i)).toBeInTheDocument();
    });

  });

  // ── Keyboard movement ───────────────────────────────────────────────────────

  describe("Keyboard controls", () => {
    beforeEach(() => {
      render(<LettuceGame />);
      fireEvent.click(screen.getByText("Let's Play!"));
      fireEvent.click(screen.getByText("Start Game"));
    });

    it("moves the basket left on ArrowLeft", () => {
      const basket = document.querySelector('[tabIndex="0"]') as HTMLElement;
      const initialLeft = parseInt(basket.style.left);
      fireEvent.keyDown(basket, { key: "ArrowLeft" });
      expect(parseInt(basket.style.left)).toBeLessThan(initialLeft);
    });

    it("moves the basket right on ArrowRight", () => {
      const basket = document.querySelector('[tabIndex="0"]') as HTMLElement;
      const initialLeft = parseInt(basket.style.left);
      fireEvent.keyDown(basket, { key: "ArrowRight" });
      expect(parseInt(basket.style.left)).toBeGreaterThan(initialLeft);
    });

    it("does not move past the left boundary (x < 20)", () => {
      const basket = document.querySelector('[tabIndex="0"]') as HTMLElement;
      for (let i = 0; i < 30; i++) fireEvent.keyDown(basket, { key: "ArrowLeft" });
      expect(parseInt(basket.style.left)).toBeGreaterThanOrEqual(10);
    });

    it("does not move past the right boundary (x > 410)", () => {
      const basket = document.querySelector('[tabIndex="0"]') as HTMLElement;
      for (let i = 0; i < 60; i++) fireEvent.keyDown(basket, { key: "ArrowRight" });
      expect(parseInt(basket.style.left)).toBeLessThanOrEqual(420);
    });
  });
});