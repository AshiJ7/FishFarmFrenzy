import { render, screen, fireEvent } from "@testing-library/react";
import FishCropMatch from "./fishmatch";

// ── Mocks ────────────────────────────────────────────────────────────────────

// Mock Firebase so tests don't hit a real DB
jest.mock("../../lib/firebase", () => ({ db: {} }));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ data: () => ({ fishCropCompleted: false }) })),
  updateDoc: jest.fn(),
  increment: jest.fn(),
}));

// Mock auth — swap `null` for a fake user object to test the logged-in path
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: null }),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Simulate dragging a crop card onto a fish card */
function dragCropToFish(cropName: string, fishName: string) {
  const cropCard = screen.getByText(cropName).closest("div")!;
  const fishCard = screen.getByText(fishName).closest("div")!;

  fireEvent.dragStart(cropCard, {
    dataTransfer: { setData: jest.fn(), getData: () => "" },
  });

  // Capture the cropId that was set during dragStart
  let capturedCropId = "";
  const mockDataTransfer = {
    setData: (_: string, value: string) => { capturedCropId = value; },
    getData: () => capturedCropId,
  };

  fireEvent.dragStart(cropCard, { dataTransfer: mockDataTransfer });
  fireEvent.dragOver(fishCard, { dataTransfer: mockDataTransfer });
  fireEvent.drop(fishCard, { dataTransfer: mockDataTransfer });
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("FishCropMatch", () => {
  beforeEach(() => render(<FishCropMatch />));

  it("renders all crop and fish cards", () => {
    ["Tomato", "Spinach", "Cucumber", "Watercress"].forEach(name =>
      expect(screen.getByText(name)).toBeInTheDocument()
    );
    ["Tilapia", "Catfish", "Trout", "Koi"].forEach(name =>
      expect(screen.getByText(name)).toBeInTheDocument()
    );
  });

  it("starts with a score of 0", () => {
    expect(screen.getByText("Score: 0")).toBeInTheDocument();
  });

  it("shows 'Correct match!' and increments score on a correct drop", () => {
    dragCropToFish("Tomato", "Tilapia"); // Tomato → Tilapia (fishMatch: 1)
    expect(screen.getByText("Score: 1")).toBeInTheDocument();
    expect(screen.getByText("Correct match!")).toBeInTheDocument();
  });

  it("shows 'Try again!' on an incorrect drop and does not increment score", () => {
    dragCropToFish("Tomato", "Koi"); // Wrong pair
    expect(screen.getByText("Score: 0")).toBeInTheDocument();
    expect(screen.getByText("Try again!")).toBeInTheDocument();
  });

  it("grays out a crop card after it is correctly matched", () => {
    dragCropToFish("Tomato", "Tilapia");
    const cropCard = screen.getByText("Tomato").closest("div")!;
    expect(cropCard).toHaveClass("opacity-40");
  });

  it("prevents re-scoring a crop that was already matched", () => {
    dragCropToFish("Tomato", "Tilapia"); // correct — score becomes 1
    dragCropToFish("Tomato", "Tilapia"); // duplicate drop — should be ignored
    expect(screen.getByText("Score: 1")).toBeInTheDocument();
  });

  it("shows the completion modal when all 4 crops are matched", () => {
    dragCropToFish("Tomato",    "Tilapia"); // fishMatch 1
    dragCropToFish("Cucumber",  "Catfish"); // fishMatch 2
    dragCropToFish("Spinach",   "Trout");   // fishMatch 3
    dragCropToFish("Watercress","Koi");     // fishMatch 4

    expect(screen.getByText("You matched them all!")).toBeInTheDocument();
  });

  it("resets the game when 'Play Again' is clicked", () => {
    // Complete the game first
    dragCropToFish("Tomato",    "Tilapia");
    dragCropToFish("Cucumber",  "Catfish");
    dragCropToFish("Spinach",   "Trout");
    dragCropToFish("Watercress","Koi");

    fireEvent.click(screen.getByText("Play Again"));

    expect(screen.getByText("Score: 0")).toBeInTheDocument();
    expect(screen.queryByText("You matched them all!")).not.toBeInTheDocument();
  });
});