
import { Node as INode } from '../types';

class ListNode<T> {
    public value: T;
    public next: ListNode<T> | null;
    public id: string;

    constructor(value: T) {
        this.value = value;
        this.next = null;
        this.id = `${value}-${Date.now()}-${Math.random()}`; // Simple unique ID
    }
}

export class LinkedList<T> {
    private head: ListNode<T> | null;
    public size: number;

    constructor() {
        this.head = null;
        this.size = 0;
    }

    // Add a node to the end of the list
    append(value: T): void {
        const newNode = new ListNode(value);
        if (!this.head) {
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode;
        }
        this.size++;
    }

    // Add a node to the beginning of the list
    prepend(value: T): void {
        const newNode = new ListNode(value);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
    }

    // Insert a node at a specific index
    insertAt(index: number, value: T): boolean {
        if (index < 0 || index > this.size) {
            return false;
        }

        if (index === 0) {
            this.prepend(value);
            return true;
        }

        const newNode = new ListNode(value);
        let current = this.head;
        let previous: ListNode<T> | null = null;
        let count = 0;

        while (count < index) {
            previous = current;
            current = current!.next;
            count++;
        }

        newNode.next = current;
        if (previous) {
            previous.next = newNode;
        }
        this.size++;
        return true;
    }

    // Delete a node by value
    delete(value: T): boolean {
        if (!this.head) {
            return false;
        }

        if (this.head.value === value) {
            this.head = this.head.next;
            this.size--;
            return true;
        }

        let current = this.head;
        let previous: ListNode<T> | null = null;

        while (current && current.value !== value) {
            previous = current;
            current = current.next;
        }

        if (!current) {
            return false; // Value not found
        }

        if (previous) {
            previous.next = current.next;
        }
        this.size--;
        return true;
    }

    // Delete a node by index
    deleteAt(index: number): boolean {
        if (index < 0 || index >= this.size) {
            return false;
        }

        if (index === 0) {
            this.head = this.head!.next;
            this.size--;
            return true;
        }

        let current = this.head;
        let previous: ListNode<T> | null = null;
        let count = 0;

        while (count < index) {
            previous = current;
            current = current!.next;
            count++;
        }

        if (previous) {
            previous.next = current!.next;
        }
        this.size--;
        return true;
    }
    
    // Find the index of a node by value
    findIndex(value: T): number {
        let count = 0;
        let current = this.head;
        while(current) {
            if (current.value === value) {
                return count;
            }
            count++;
            current = current.next;
        }
        return -1;
    }

    // Convert the list to an array for rendering
    toArray(): INode<T>[] {
        const result: INode<T>[] = [];
        let current = this.head;
        while (current) {
            result.push({ value: current.value, id: current.id });
            current = current.next;
        }
        return result;
    }
}
