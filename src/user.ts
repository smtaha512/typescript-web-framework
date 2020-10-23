export interface UserProps {
  id: number;
  name: string;
  age: number;
}

type ValuesTypes<T> = T[keyof T];
type Callback = () => void;
export class User {
  private events: Record<string, Callback[]> = {};
  constructor(private data?: Partial<UserProps>) {}

  get(propName: string): ValuesTypes<UserProps> {
    if (!propName) {
      throw new Error('Invalid prop name');
    }

    return (this.data ?? {})[propName];
  }

  set(update: Partial<UserProps>): void {
    this.data = { ...(this.data ?? {}), ...update };
  }

  on(eventName: string, cb: Callback): void {
    this.events[eventName] = [...(this.events[eventName] ?? []), cb];
  }

  trigger(eventName: string): void {
    (this.events[eventName] ?? []).forEach((callback) => callback());
  }

  fetch(id: string): Promise<void> {
    return fetch(`http://localhost:3000/users/${id}`)
      .then((res) => res.json())
      .then(this.set);
  }

  save(): void {
    const { id } = this.data;
    const headers = new Headers({
      'Content-Type': 'application/json; charset=UTF-8',
    });
    fetch(`http://localhost:3000/users/${id ?? ''}`, {
      body: JSON.stringify(this.data),
      method: id ? 'PUT' : 'POST',
      headers,
    });
  }
}
