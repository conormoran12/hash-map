import NewNode from "./node-creator.js";

export default class LinkedList {


    constructor() {
        this.head = null;
        this.listSize = 0;
        this.lastNode = null;
    }

    get tail() {
        return this.lastNode;
    }

    set tail(node) {
        this.lastNode = node;
    }

    get size() {
        return this.listSize;
    }

    set size(value) {
        this.listSize = value;
    }

    append(key, value) {
        if (key == null || key == undefined || value == null || value == undefined) return;
        const newNode = new NewNode(key, value);
        if (this.head == null) this.head = newNode;
        if (this.tail == null) {
            this.tail = newNode;
        } else {
            this.tail.nextNode = newNode;
            this.tail = newNode;
        }
        this.size = this.size + 1;
    }

    //   prepend(value) {
    //       if (value == null || value == undefined) return;
    //       const newNode = new NewNode(value);
    //       newNode.nextNode = this.head;
    //       this.head = newNode;
    //       this.size = this.size + 1;
    //   }

    contains(key, node = this.head) {
        if (node.key == key) {
            return true;
        } else {
            if (node.nextNode != undefined) {
                return this.contains(key, node.nextNode);
            }
            return false;
        }
    }

    at(index, node = this.head) {
        if (node == null) return null;
        if (node.nextNode && index != 0) {
            index--;
            return this.at(index, node.nextNode);
        } else if (index == 0) {
            return node;
        } else {
            return null;
        }
    }

    find(key, node = this.head, index = 0) {
        if (node.key == key) {
            return index;
        } else if (node.key != key) {
            index += 1;
            if (node.nextNode == undefined) return null;
            return this.find(key, node.nextNode, index);
        }
    }

    pop() {
        if (this.size < 1) return;
        const previousNodeIndex = this.find(this.tail.value) - 1;
        if (this.head == this.tail) {
            this.head = null;
            this.tail = null;
            this.size = this.size - 1;
            return;
        }
        const previousNode = this.at(previousNodeIndex);
        previousNode.nextNode = null;
        this.tail = previousNode;
        this.size = this.size - 1;
    }

    //   toString(node = this.head, string = ``) {
    //       if (node == null) return `null`;
    //       if (node.nextNode) {
    //           string = string.concat(`( ${node.value} ) -> `);
    //           return this.toString(node.nextNode, string);
    //       } else {
    //           string = string.concat(`( ${node.value} ) -> null`);
    //       }
    //       return string;
    //   }

    insertAt(key, value, index) {
        if (index < 0 || index > this.size) return;
        if (index == 0) {
            if (this.head.key != key) {
                const newNode = new NewNode(key, value, this.head);
                this.head = newNode;
                this.size = this.size + 1;
            } else {
                this.head.value = value;
            }
        }
        else if (index == this.size) {
            if (this.tail.key != key) {
                const newNode = new NewNode(key, value, null);
                this.tail.nextNode = newNode;
                this.tail = newNode;
                this.size = this.size + 1;
            } else if (this.tail.key == key) {
                this.tail.value = value;
            }
        }
        else {
            if (this.at(index).key != key) {
                const newNode = new NewNode(key, value, this.at(index + 1));
                this.head = newNode;
                this.at(index - 1).nextNode = newNode;
                this.size = this.size + 1;
            } else {
                this.at(index).value = value;
            }
        }
    }

    removeAt(index) {
        if (index < 0 || index >= this.size) return;
        if (index == 0) {
            if (this.head == this.tail) {
                this.head = null;
                this.tail = null;
                this.size = this.size - 1;
                return;
            }
            this.head = this.head.nextNode;
            this.size = this.size - 1;
            return;
        }
        else if (index == this.size - 1) {
            this.tail = null;
            this.tail = this.at(index - 1);
            this.tail.nextNode = null;
            this.size = this.size - 1;
            return;
        }
        this.at(index - 1).nextNode = this.at(index + 1);
        this.size = this.size - 1;
    }

    remove(key) {
        let index = 0;
        let current = this.head;
        while (current) {
            if (current.key == key) {
                break;
            }
            index++;
            current = current.nextNode;
        }
        if (index < 0 || index >= this.size) return;
        if (index == 0) {
            if (this.head == this.tail) {
                this.head = null;
                this.tail = null;
                this.size = this.size - 1;
                return;
            }
            this.head = this.head.nextNode;
            this.size = this.size - 1;
            return;
        }
        else if (index == this.size - 1) {
            this.tail = null;
            this.tail = this.at(index - 1);
            this.tail.nextNode = null;
            this.size = this.size - 1;
            return;
        }
        this.at(index - 1).nextNode = this.at(index + 1);
        this.size = this.size - 1;
    }
}