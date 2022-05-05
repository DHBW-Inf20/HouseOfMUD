/**
 * @module RabbitMQContext
 * @category React Contexts
 * @description Context for using RabbitMQ
 * @contextMethods {@linkcode login}, {@linkcode logout}, {@linkcode sendMessage}, {@linkcode setChatSubscriber}
 */

import React from 'react';
import { useAuth } from 'src/hooks/useAuth';
import { useGame } from 'src/hooks/useGame';
import { Client, IFrame, IMessage } from '@stomp/stompjs';
import { RabbitMQPayload, SendActions } from 'src/types/rabbitMQ';
import { Navigate, useNavigate } from 'react-router-dom';
import { MiniMapData } from 'src/components/Game/Minimap';
import { InventoryProps } from 'src/components/Game/Inventory';
import { HUDProps } from 'src/components/Game/HUD';

const debug = true;

export interface RabbitMQContextType {
  login: (callback: VoidFunction, error: (error: string) => void) => void;
  logout: (callback: VoidFunction, error: (error: string) => void) => void;
  sendCharacterMessage: (message: string, callback: VoidFunction, error: (error: string) => void) => void;
  sendDmMessage: (message: string, callback: VoidFunction, error: (error: string) => void) => void;
  setChatSubscriber: (subscriber: (message: string) => void) => void;
  setErrorSubscriber: (subscriber: (message: any, ...optionalParams: any[]) => void) => void;
  setMiniMapSubscriber: (subscriber: (rooms: MiniMapData) => void) => void;
  setRoomSubscriber: (subscriber: (roomId: string) => void) => void;
  setInventorySubscriber: (subscriber: (items: InventoryProps["inventoryData"]) => void) => void;
  setHudSubscriber: (subscriber: (hud: HUDProps) => void) => void;
}

let RabbitMQContext = React.createContext<RabbitMQContextType>({} as RabbitMQContextType);

const rabbit = new Client({
  brokerURL: process.env.REACT_APP_RABBITMQ || 'wss://mud-ga.me:15673/ws',
});

// rabbit.debug = console.log;

var payloadTemplate = {
  user: '',
  character: '',
  verifyToken: ''
}

function RabbitMQProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { character, dungeon, verifyToken } = useGame();
  
  let chatSubscriber: (message: string) => void = () => { };
  let errorSubscriber: (error: string, ...optionalParams: any[]) => void = (error) => { };
  let inventorySubscriber: (message: any) => void = () => { };
  let hudSubscriber: (message: any) => void = () => { };
  let miniMapSubscriber: (message: any) => void = () => { };
  let roomSubscriber: (message: any) => void = () => { };

  const processAction = (message: IMessage) => {
    try {
      let jsonData: {action:string, data:any} = JSON.parse(message.body);
      //TODO: Decide what type of message we received
      debug && console.log(jsonData);
      if (jsonData['action'] === undefined) {
        errorSubscriber("RabbitMQ-Message is missing a action-key");
        return;
      } else if (jsonData['data'] === undefined) {
        errorSubscriber("RabbitMQ-Message is missing a data");
        return;
      }
      const command = jsonData['action'].split('.');
      switch (command[0]) {
        case 'message':
          chatSubscriber(jsonData.data); // atm only chats
          break;
        case 'minimap':
          minimapHandler(command.splice(1), jsonData.data);
          break;
        case 'inventory':
          inventorySubscriber(jsonData.data);
          break;
        case 'stats':
          hudSubscriber(jsonData.data);
          break;
        default:
          errorSubscriber("RabbitMQ-Action not implemented yet: ", jsonData.action);
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        errorSubscriber("Message Received from RabbitMQ is not valid JSON!: " + message.body);
      }
    }

  }

  const setErrorSubscriber = (subscriber: (message: any, ...optionalParams: any[]) => void) => {
    errorSubscriber = subscriber;
  }


  const sendPayload = (payload: RabbitMQPayload) => {
    if (rabbit.connected) {
      rabbit.publish({
        destination: `/exchange/ServerExchange/${dungeon}`,
        body: JSON.stringify(payload)
      });
    }
  }

  const login = (callback: VoidFunction, error: (error: string) => void) => {
    if (rabbit.active) {
      error('RabbitMQ is already connected');
      return;
    }

    payloadTemplate = {
      user: user,
      character: character,
      verifyToken: verifyToken,
    }

    rabbit.activate();
    let loginPayload: RabbitMQPayload = {
      action: 'login',
      ...payloadTemplate,
      data: {}
    };

    let firstConnect = true;

    rabbit.onConnect = () => {
      if (firstConnect) {
        rabbit.subscribe(`/queue/${dungeon}-${character}`, (message: IMessage) => {
          processAction(message);
        }, { "auto-delete": "true" });

        sendPayload(loginPayload);
        firstConnect = false;
      } else {
        logout(() => { }, (error) => {
          errorSubscriber("rabbitmq.logout");
        });
        rabbit.forceDisconnect();
        // TODO: show idle timeout error 
        navigate('/');
      }
    }
    rabbit.onStompError = (receipt: IFrame) => {
      errorSubscriber(receipt.body);
    }
    callback();
  }

  const logout = (callback: VoidFunction, error: (error: string) => void) => {
    if (!rabbit.active) {
      error('RabbitMQ is not connected');
      return;
    }
    let logoutPayload: RabbitMQPayload = {
      action: 'logout',
      ...payloadTemplate,
      data: {}
    }
    sendPayload(logoutPayload);
    rabbit.deactivate();
    callback();
  }

  const sendMessage = (message: string, action: SendActions,  callback: VoidFunction, error: (error: string) => void) => {
    if (!rabbit.connected) {
      error("RabbitMQ is not connected");
      return;
    }
    let messagePayload: RabbitMQPayload = {
      action,
      ...payloadTemplate,
      data: {
        message
      }
    }
    sendPayload(messagePayload);
    callback();

  }

  const sendCharacterMessage = (message: string, callback: VoidFunction, error: (error: string) => void) => {
    sendMessage(message, 'message', callback, error);
  }

  const sendDmMessage = (message: string, callback: VoidFunction, error: (error: string) => void) => {
    sendMessage(message, 'dmmessage', callback, error);
  }



  const setChatSubscriber = (subscriber: (message: string) => void) => {
    chatSubscriber = subscriber;
  }

  const setMiniMapSubscriber = (subscriber: (rooms: MiniMapData) => void) => {
    miniMapSubscriber = subscriber;
  }

  const setRoomSubscriber = (subscriber: (roomId: string) => void) => {
    roomSubscriber = subscriber;
  }

  const setInventorySubscriber = (subscriber: (items: InventoryProps["inventoryData"]) => void) => {
    inventorySubscriber = subscriber;
  }

  const setHudSubscriber = (subscriber: (hud: HUDProps) => void) => {
    hudSubscriber = subscriber;
  }

  const minimapHandler = (command: string[], data: any) => {
    switch(command[0]) {
      case 'init':
        miniMapSubscriber(data);
        break;
      case 'move':
        roomSubscriber(data);
        break;
    }
  }

  let value = { login, logout, sendMessage, setChatSubscriber, setErrorSubscriber, setMiniMapSubscriber, setRoomSubscriber, setInventorySubscriber, setHudSubscriber, sendCharacterMessage, sendDmMessage };

  return <RabbitMQContext.Provider value={value}>{children}</RabbitMQContext.Provider>;
}
export { RabbitMQContext, RabbitMQProvider };