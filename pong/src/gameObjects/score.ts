class Score {
    left: number;
    right: number;

    constructor() {
        this.left = 0;
        this.right = 0;
    }

    update(left: number, right: number): void {
        this.left = left;
        this.right = right;
    }

    toString(): string {
        return this.left + " - " + this.right;
    }

}

export default Score;