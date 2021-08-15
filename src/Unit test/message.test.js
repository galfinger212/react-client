import { render } from '@testing-library/react';
import Message from 'components/message/Message'
const messageMock = { text: "helloMock", createdAt: "2021-07-29T13:56:23.028+00:00" }
describe("Message component", () => {
    it("rendered Message div", () => {
        const { getByTestId } = render(<Message message={messageMock} />);
        const div = getByTestId("messageDiv");
        expect(div).toBeTruthy();
    })

    it("rendered metadataSpan", () => {
        const { getByTestId } = render(<Message message={messageMock} />);
        const span = getByTestId("metadataSpan");
        expect(span).toBeTruthy();
    })

    it("rendered timeMessageSpan", () => {
        const { getByTestId } = render(<Message message={messageMock} />);
        const span = getByTestId("timeMessageSpan");
        expect(span).toBeTruthy();
    })

    it("rendered tickSpan", () => {
        const { getByTestId } = render(<Message message={messageMock} />);
        const span = getByTestId("tickSpan");
        expect(span).toBeTruthy();
    })

    it("should be a blue tick - message's owner. the other user see the message", () => {
        const { getByTestId } = render(<Message message={messageMock} own={true} seen={true} />);
        const div = getByTestId("blueTick");
        expect(div).toBeTruthy();
    })

    it("should not be a blue tick - message's owner. the other user didn't see the message", () => {
        const { queryByTestId } = render(<Message message={messageMock} own={true} seen={false} />);
        const div = queryByTestId("blueTick");
        expect(div).toBeFalsy();
    })

    it("should be a grey tick - message's owner. the other user didn't see the message", () => {
        const { getByTestId } = render(<Message message={messageMock} own={true} seen={false} />);
        const div = getByTestId("greyTick");
        expect(div).toBeTruthy();
    })

    it("should not be any tick - message's not owner.", () => {
        const { queryByTestId } = render(<Message message={messageMock} own={false} />);
        const divGrey = queryByTestId("greyTick");
        const divBlue = queryByTestId("blueTick");
        expect(divGrey).toBeFalsy();
        expect(divBlue).toBeFalsy();
    })
})