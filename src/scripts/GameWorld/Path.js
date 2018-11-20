import Vector from "../engine/Vector.js";

export default class Path {
    constructor() {
        this.untestedNodes = [];
        this.node = [];
        this.foundPath = false;
        this.completePath = [];
    }
    
    // sorts the array    
    sortDistance(a, b) { 
        return (this.node[a.x][a.y].distanceGoal + this.node[a.x][a.y].distanceStart)
            - (this.node[b.x][b.y].distanceGoal + this.node[b.x][b.y].distanceStart);
    }

    // calculate the distance between firstNode and secondNode
    heuristic(x1, y1, x2, y2) {
        // should use distance instead of constant grid
        return Math.sqrt(
            (x1 - x2) 
            * (x1 - x2)
            + (y1 - y2) 
            * (y1 - y2)
        );
    }

    // ENTRY POINT! gets the path
    calculate(node, start, goal) {

        // reset nodes, and empties untestedNodes!
        this.node = node.slice();
        this.node.forEach((row) => {
            row.forEach((nodette) => {
                nodette.isVisited = false;
                nodette.distanceGoal = Infinity;
                nodette.distanceStart = Infinity;
                nodette.parentNode = null;
                nodette.childNode = null;
            });       
        });

        this.untestedNodes = [];
        // Sets up the start node and adds it to queue.

        this.node[start.x][start.y].distanceStart = 0;
        this.node[start.x][start.y].distanceGoal = this.heuristic(start.x, start.y, goal.x, goal.y);
        this.untestedNodes.push(new Vector(start.x, start.y));

        // Start of loop, while there are unexplored nodes.
        while(this.untestedNodes.length!==0) {
            this.untestedNodes.sort(this.sortDistance.bind(this));

            // While there are untested nodes and the first on is visited, then pop it!
            while(this.untestedNodes.length!==0 && this.node[this.untestedNodes[0].x][this.untestedNodes[0].y].isVisited) {
                this.untestedNodes.shift();
            }

            // Break if there are no more nodes to test!
            if(this.untestedNodes.length === 0) {                 
                break; 
            }

            // Set up node to test
            const currentNode = this.node[this.untestedNodes[0].x][this.untestedNodes[0].y];
            currentNode.isVisited = true;
            // currentNode.color="pink";

            // If we reached the goal, then JACKPOT!
            if(currentNode === node[goal.x][goal.y]) { 
                this.foundPath = true;
                break;
            }

            // Visit all neighbours
            
            for(let index = 0; index < currentNode.neighbours.length; index++) {
                const neighbour = this.node[currentNode.neighbours[index].x][currentNode.neighbours[index].y];
                const compareNum = currentNode.distanceStart + 1;

                // if this path is shorter than current path to neighbour (without obstacle), then update neighbour
                if(compareNum < neighbour.distanceStart 
                &&  neighbour.isValid()) {
                    neighbour.parentNode = new Vector(this.untestedNodes[0].x, this.untestedNodes[0].y);
                    neighbour.distanceStart = compareNum;
                }

                // if there is no obstacle, and it is not visited, then add to queue    
                if(!neighbour.isVisited && neighbour.isValid()) {
                    neighbour.distanceGoal = this.heuristic(currentNode.neighbours[index].x,currentNode.neighbours[index].y, goal.x, goal.y);
                    this.untestedNodes.push(new Vector(currentNode.neighbours[index].x, currentNode.neighbours[index].y));
                }
            }
        }
        if(this.foundPath) {

            let target = [];
            
            let path = new Vector(goal.x, goal.y);
            // node[path.x][path.y].childNode = null;
            // this.completePath.push(path);
            target.push(path);

            while(node[path.x][path.y].parentNode) {
                let parents = node[path.x][path.y].parentNode;

                node[parents.x][parents.y].childNode = new Vector(path.x, path.y);

                node[path.x][path.y].activate(node[path.x][path.y].parentNode, node[path.x][path.y].childNode, path);
                path = new Vector(parents.x, parents.y);
                target.push(path);
    
            }

            node[path.x][path.y].activate(null, node[path.x][path.y].childNode, path);
            return target;

        }
        else return []; // RETURN EMPTY ARRAY IF NO PATH FOUND;
    } // END OF CALCULATION
}
 