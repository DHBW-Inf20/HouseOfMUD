/**
 * @module ChatInput
 * @category React Components
 * @description ChatInput Component to get the input from the user
 * @children {@linkcode ChatInputOutput} {@linkcode ChatInputInput}
 * @props {@linkcode ChatInputProps}
 */

import React, { FormEvent } from 'react'
import $ from "jquery";
import { Row } from 'react-bootstrap';
import { CloudArrowUp, Send } from 'react-bootstrap-icons';
import { useRabbitMQ } from "src/hooks/useRabbitMQ";
import { useMudConsole } from '../../../hooks/useMudConsole';
export interface ChatInputProps { }

const ChatInput: React.FC<ChatInputProps> = ({ }) => {

    const { sendMessage } = useRabbitMQ();
    const homsole = useMudConsole();
    const sendInput = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        let formData = new FormData(evt.currentTarget);
        let message = formData.get('message') as string;
        sendMessage(message, () => {
            homsole.log(message, "Message sent succesfully",);
        }, (error) => {
            homsole.error(error, "RabbitMQ");
        })
        $("#chat-input").val("");
    }

    return (
        <form className="chat-input-wrap " onSubmit={sendInput}>
            <Row className="h-100 mt-3">
                <div className="col-10">
                    <input type="text" name="message" id="chat-input" required autoComplete='off' />
                </div>
                <div className="col-1">
                    <button className="btn px-0 w-100 drawn-border btn-blue" type="submit">
                        <CloudArrowUp />
                    </button>
                </div>
                <div className="col-1">
                    <button className="btn px-0 w-100 drawn-border btn-green" type="submit">
                        <Send/>
                    </button>
                </div>
            </Row>
        </form>
    )
}

export default ChatInput;    