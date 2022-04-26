/**
 * @module ChatOutput
 * @category React Components
 * @description ChatOutput Component to display the Chat-Feedback from RabbitMQ
 * @children {@linkcode ChatOutputOutput} {@linkcode ChatOutputInput}
 * @props {@linkcode ChatOutputProps}
 */

import { IMessage } from '@stomp/stompjs';
import React, { useState } from 'react'
import { useRabbitMQ } from 'src/hooks/useRabbitMQ';
import { useEffect } from 'react';
import { Row } from 'react-bootstrap';

export interface ChatOutputProps {}


const ChatOutput: React.FC<ChatOutputProps> = () => {

    console.log('ASDasdasdasd');
    
    const [messages, setMessages] = useState<string[]>([]);

    // const [message, setMessage] = useState<string>();

    // const [messages, setMessages] = useState("Mock");

    // const messages: string[] = [];

    const {setChatSubscriber} = useRabbitMQ();

    let addMessage = (message: string) => {
        setMessages([...messages, message]);
    };

    setChatSubscriber((data: any)=>{

        addMessage(data.message);

        // messages.push(data.message);
        // setMessage(data.message);

        // setMessages([...messages!, data.message]);
        // setMessage({ message: message });
        // setMessages(message)
    });
    
    return (
        <Row>
            <div className="col">
                <span>CHAT-OUTPUT</span>
                <div className="mock-placeholder chat drawn-border p-2">
                    {messages.map((message, index) => {
                        return (
                            <div key={index} className={"chat-message channel-global"}>
                                {message}
                            </div>
                        )
                    })}
                </div>      
            </div>
        </Row>
    )
}

export default ChatOutput;    