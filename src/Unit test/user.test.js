import { render } from '@testing-library/react';
import User from 'components/User/User';

describe("user component", () => {
    it("rendered user-bar div", () => {
        const { getByTestId } = render(<User />);
        const div = getByTestId("user-bar");
        expect(div).toBeTruthy();
    })

    it("rendered avatar div", () => {
        const { getByTestId } = render(<User />);
        const div = getByTestId("avatar");
        expect(div).toBeTruthy();
    })

    it("rendered username div", () => {
        const { getByTestId } = render(<User />);
        const div = getByTestId("username");
        expect(div).toBeTruthy();
    })

    it("typing span should not be appear", () => {
        const { queryByTestId } = render(<User typing={false} />);
        const span = queryByTestId("typingSpan");
        expect(span).toBeFalsy();
    })

    it("typing span should be appear", () => {
        const { getByTestId } = render(<User typing={true} />);
        const span = getByTestId("typingSpan");
        expect(span).toBeTruthy();
    })

    it("check render spanUserName", () => {
        const { getByTestId } = render(<User />);
        const span = getByTestId("spanUserName");
        expect(span).toBeTruthy();
    })
})