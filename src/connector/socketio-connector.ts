import { Connector } from './connector';
import { SocketIoChannel, SocketIoPresenceChannel } from './../channel';

/**
 * This class creates a connnector to a Socket.io server.
 */
export class SocketIoConnector extends Connector {

    /**
     * The Socket.io connection instance.
     *
     * @type {object}
     */
    socket: any;

    /**
     * All of the subscribed channel names.
     *
     * @type {any}
     */
    channels: any = {};

    /**
     * Create a fresh Socket.io connection.
     *
     * @return void
     */
    connect(): void {
        this.socket = io(this.options.host);

        return this.socket;
    }

    /**
     * Listen for an event on a channel instance.
     */
    listen(name: string, event: string, callback: Function): SocketIoChannel {
        return this.channel(name).listen(event, callback);
    }

    /**
     * Get a channel instance by name.
     *
     * @param  {string}  name
     * @return {SocketIoChannel}
     */
    channel(name: string): SocketIoChannel {
        if (!this.channels[name]) {
            this.channels[name] = new SocketIoChannel(
                name,
                this.socket,
                this.options
            );
        }

        return this.channels[name];
    }

    /**
     * Get a private channel instance by name.
     *
     * @param  {string}  name
     * @return {SocketIoChannel}
     */
    privateChannel(name: string): SocketIoChannel {
        if (!this.channels['private-' + name]) {
            this.channels['private-' + name] = new SocketIoChannel(
                'private-' + name,
                this.socket,
                this.options
            );
        }

        return this.channels['private-' + name];
    }

    /**
     * Get a presence channel instance by name.
     *
     * @param  {string} name
     * @return {PresenceChannel}
     */
    presenceChannel(name: string): SocketIoPresenceChannel {
        if (!this.channels['presence-' + name]) {
            this.channels['presence-' + name] = new SocketIoPresenceChannel(
                'presence-' + name,
                this.socket,
                this.options
            );
        }

        return this.channels['presence-' + name];
    }

    /**
     * Leave the given channel.
     *
     * @param  {string} name
     * @return {void}
     */
    leave(name: string): void {
        let channels = [name, 'private-' + name, 'presence-' + name];

        channels.forEach(name => {
            if (this.channels[name]) {
                this.channels[name].unsubscribe();

                delete this.channels[name];
            }
        });
    }

    /**
     * Get the socket ID for the connection.
     *
     * @return {string}
     */
    socketId(): string {
        return this.socket.id;
    }
}
