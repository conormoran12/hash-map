class HashMap {

    constructor(loadFactor) {
        this.loaderFactor = loadFactor;
        this.capacity = 16;
        this.count = 0;
        this.array = [];
    }

    hash(key) {
        let hashCode = 0;

        const primeNumber = 31;
        for (let i = 0; i < key.length; i++) {
            hashCode = primeNumber * (hashCode + key.charCodeAt(i));
        }

        return hashCode;
    }

    get length() {
        return this.count;
    }

    get keys() {
        let keys = [];
        for (const bucket in this.array) {
            const node = this.array[bucket];
            if (node && node.key) {
                keys.push(node.key);
            } else if (node instanceof LinkedList) {
                for (let i = 0; i < node.size; i++) {
                    keys.push(node.at(i).key);
                }
            }
        }
        return keys;
    }

    get values() {
        let values = [];
        for (const bucket in this.array) {
            const node = this.array[bucket];
            if (node && node.value) {
                values.push(node.value);
            } else if (node instanceof LinkedList) {
                let current = node.head;
                while (current) {
                    values.push(current.value);
                    current = current.nextNode;
                }
            }
        }
        return values;
    }

    remove(key) {
        const hash = this.hash(key);
        const bucket = hash % this.capacity;

        let node = this.array[bucket];

        if (node && node instanceof LinkedList == false) {
            this.array[bucket] = null;
            this.count--;
            return true;
        } else if (node && node instanceof LinkedList) {
            node.remove(key);
            this.count--;
            if (node.size == 1) {
                this.array[bucket] = { key: node.head.key, value: node.head.value };
            }
            return true;
        }
        return false;
    }

    get(key) {
        const hash = this.hash(key);
        const bucket = hash % this.capacity;
        const node = this.array[bucket];
        if (node && node instanceof LinkedList) {
            let current = node.head;
            while (current) {
                if (current.key == key) return current.value;
                current = current.nextNode;
            }
        } else if (node) {
            if (node.key == key) {
                return node.value;
            }
        }
        return null;
    }

    entries() {
        const arrOfEntries = [];
        for (const bucket in this.array) {
            const node = this.array[bucket];
            if (node instanceof LinkedList == false && node != null) {
                arrOfEntries.push([node.key, node.value]);
            } else if (node instanceof LinkedList) {
                let current = node.head;
                while (current) {
                    arrOfEntries.push([current.key, current.value]);
                    current = current.nextNode;
                }
            }
        }
        return arrOfEntries;
    }

    entry(key) {
        const hash = this.hash(key);
        const index = hash % this.capacity;

        const node = this.array[index];

        if (node && node.key == key) {
            return true;
        } else if (node instanceof LinkedList) {
            let current = node.head;
            while (current) {
                if (current.key == key) {
                    return true;
                }
                current = current.nextNode;
            }
        }
        return false;
    }

    clear() {
        this.array = [];
        this.capacity = 16;
        this.count = 0;
    }

    has(key) {
        const hash = this.hash(key);
        const index = hash % this.capacity;

        const node = this.array[index];
        if (node && node instanceof LinkedList == false) {
            if (node.key && node.key == key) return true;
        } else if (node && node instanceof LinkedList) {
            let current = node.head;
            while (current) {
                if (current.key == key) {
                    return true;
                }
                current = current.nextNode;
            }
        }
        return false;
    }

    resize() {
        if (this.count >= Math.floor(this.capacity * this.loaderFactor)) {
            this.capacity *= 2;
            const newArray = [];
            for (const bucket in this.array) {
                const node = this.array[bucket];
                if (node && node instanceof LinkedList == false) {

                    const existingKey = node.key;
                    const existingValue = node.value;

                    const hash = this.hash(node.key);
                    const index = hash % this.capacity;

                    newArray[index] = { key: existingKey, value: existingValue };
                } else if (node && node instanceof LinkedList) {
                    let current = node.head;
                    while (current) {

                        const hash = this.hash(current.key);
                        const newBucket = hash % this.capacity;

                        let node = newArray[newBucket];

                        if (node && node.key != current.key) {
                            const linkedList = new LinkedList();
                            linkedList.append(node.key, node.value);
                            linkedList.append(current.key, current.value);

                            newArray[newBucket] = linkedList;
                        } else if (node instanceof LinkedList) {
                            node.append(current.key, current.value);
                        } else {
                            newArray[newBucket] = { key: current.key, value: current.value };
                        }
                        current = current.nextNode;
                    }
                }
            }
            this.array = newArray;
        }
    }

    // bucket(key) {

    // }

    set(key, value) {
        const hash = this.hash(key);
        const index = hash % this.capacity;

        let node = this.array[index];
        if (!this.entry(key)) {
            this.resize();
            this.array[index] = { key: key, value: value };
            this.count++;
        } else {
            if (node && node.key && node.key == key) {
                node.value = value;
            } else if (node.key && node.key != key) {
                const linkedList = new LinkedList();

                linkedList.append(node.key, node.value);
                linkedList.append(key, value);

                this.array[index] = linkedList;
                this.count++;
            } else if (node instanceof LinkedList) {
                let current = node.head;

                let i = 0;
                let isAnEntry = false;
                while (current) {
                    if (current.key == key) {
                        node.insertAt(key, value, i);
                        isAnEntry = true;
                        break;
                    }
                    i++;
                    current = current.nextNode;
                }
                if (isAnEntry == false) {
                    node.append(key, value);
                    this.resize();
                    this.count++;
                }
            }
        }
    }
}



class LinkedList {


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

class NewNode {

    constructor(key, value, nextNode) {
        this.key = key;
        this.value = value;
        this.nextNode = nextNode;
    }
}



const test = new HashMap(0.75);

test.set('apple', 'red');
test.set('banana', 'yellow');
test.set('carrot', 'orange');
test.set('dog', 'brown');
test.set('elephant', 'gray');
test.set('frog', 'green');
test.set('grape', 'purple');
test.set('hat', 'black');
test.set('ice cream', 'white');
test.set('jacket', 'blue');
test.set('kite', 'pink');
test.set('lion', 'golden');