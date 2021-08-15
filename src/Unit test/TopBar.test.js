import { render } from '@testing-library/react';
import Topbar from 'components/topbar/Topbar'
import { BrowserRouter as Router } from 'react-router-dom';

describe("Topbar component", () => {
    it("rendered topbarContainer div", () => {
        const { getByTestId } = render(<Router><Topbar /></Router>);
        const div = getByTestId("topbarContainer");
        expect(div).toBeTruthy();
    })

    it("rendered topbarLeft div", () => {
        const { getByTestId } = render(<Router><Topbar /></Router>);
        const div = getByTestId("topbarLeft");
        expect(div).toBeTruthy();
    })

    it("rendered topbarRight div", () => {
        const { getByTestId } = render(<Router><Topbar /></Router>);
        const div = getByTestId("topbarRight");
        expect(div).toBeTruthy();
    })

    it("rendered topbarLinks div", () => {
        const { getByTestId } = render(<Router><Topbar /></Router>);
        const div = getByTestId("topbarLinks");
        expect(div).toBeTruthy();
    })

    it("rendered topbarIcons div", () => {
        const { getByTestId } = render(<Router><Topbar /></Router>);
        const div = getByTestId("topbarIcons");
        expect(div).toBeTruthy();
    })

    it("rendered topbarIconItem divs", () => {
        const { getAllByTestId } = render(<Router><Topbar /></Router>);
        const divs = getAllByTestId("topbarIconItem");
        expect(divs.length).toBe(2);
    })

})