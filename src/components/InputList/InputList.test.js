import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import InputList from "./index";

describe("Check out input component has a button", () => {
  test('Our button has the text of "Add to list"', () => {
    // arrange

    const buttonText = "Add to list";
    render(<InputList addToList={() => jest.fn()} buttonText={buttonText} />);

    // act
    let button = screen.getByRole("button");

    // assert
    expect(button).toHaveTextContent("buttonText");
  });
});
