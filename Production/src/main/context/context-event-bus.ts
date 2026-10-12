import { EventEmitter } from 'events'
import { ContextEvent, ContextEventType, DeviceContext } from './context-types'

export class ContextEventBus extends EventEmitter {
  private static instance: ContextEventBus | null = null
  private recentEvents: ContextEvent[] = []
  private maxHistory = 100

  private constructor() {
    super()
    this.setMaxListeners(50)
  }

  public static getInstance(): ContextEventBus {
    if (!ContextEventBus.instance) {
      ContextEventBus.instance = new ContextEventBus()
    }
    return ContextEventBus.instance
  }

  public publish(
    type: ContextEventType,
    context: DeviceContext,
    payload?: any
  ): ContextEvent {
    const event: ContextEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      timestamp: Date.now(),
      context,
      payload
    }

    this.recentEvents.unshift(event)
    if (this.recentEvents.length > this.maxHistory) {
      this.recentEvents.pop()
    }

    this.emit(type, event)
    this.emit('ALL_EVENTS', event)
    return event
  }

  public onEvent(type: ContextEventType, listener: (event: ContextEvent) => void): () => void {
    this.on(type, listener)
    return () => this.off(type, listener)
  }

  public onAny(listener: (event: ContextEvent) => void): () => void {
    this.on('ALL_EVENTS', listener)
    return () => this.off('ALL_EVENTS', listener)
  }

  public getRecentEvents(count = 20): ContextEvent[] {
    return this.recentEvents.slice(0, count)
  }

  public clear(): void {
    this.recentEvents = []
    this.removeAllListeners()
  }
}
