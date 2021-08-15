import { render } from '@testing-library/react';
import Grid from 'UIKit/Layouts/Grid'
describe("Grid component", () => {
    it("rendered gridDiv", () => {
        const { getByTestId } = render(<Grid />);
        const div = getByTestId("gridDiv");
        expect(div).toBeTruthy();
    })

    it("rendered gridDiv with no children's", () => {
        const { getByTestId } = render(<Grid />);
        const div = getByTestId("gridDiv");
        expect(div.children.length).toBe(0);
    })

    it("rendered gridDiv with children's", () => {
        const { getByTestId } = render(<Grid><div>children</div></Grid>);
        const div = getByTestId("gridDiv");
        expect(div.children.length).toBe(1);
    })
})