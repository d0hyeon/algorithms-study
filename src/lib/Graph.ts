class Vertex {
  key: string;
  next: Vertex | null;
  arc: Arc | null;

  constructor(key: string) {
    this.key = key;
    this.next = null;
    this.arc = null;
  }
  
  get arcs() {
    const arcArr = [];
    let arc = this.arc;
    while (arc) {
      arcArr.push(arc);
      arc = arc.next;
    }

    return arcArr;
  }
}

class Arc {
  destination: Vertex;
  distance: number;
  next: Arc | null;
  data?: any;
  inTree: boolean = false;

  constructor(destination: Vertex, distance = 1, data?: any) {
    this.data = data;
    this.destination = destination;
    this.distance = distance;
    this.next = null;
  }
}

interface VertexRoute {
  vertex: Vertex;
  distance: number;
  child?: VertexRoute[]
}

class Graph<T = any> {
  head: Vertex | null;
  count: number;
  constructor() {
    this.head = null;
    this.count = 0;
  }
  addVertex(key: string) {
    const vertex = new Vertex(key);

    if (this.head) {
      let lastVertex = this.head;
      while (lastVertex.next) {
        lastVertex = lastVertex.next;
      }
      lastVertex.next = vertex;
    } else {
      this.head = vertex;
    }
    return this;
  }
  addArc(fromKey: string, toKey: string, distance: number, data?: T) {
    let formVertex = this.head;
    let toVertex = this.head;

    while (formVertex && formVertex.key !== fromKey) {
      formVertex = formVertex.next;
    }
    while (toVertex && toVertex.key !== toKey) {
      toVertex = toVertex.next;
    }
    if (formVertex === null || toVertex === null) {
      return this;
    }
  
    const arc = new Arc(toVertex, distance, data);

    if (formVertex.arc) {
      let lastFromVertexArc = formVertex.arc;
      while (lastFromVertexArc.next) {
        lastFromVertexArc = lastFromVertexArc.next;
      }
      lastFromVertexArc.next = arc;
    } else {
      formVertex.arc = arc;
    }
    return this;
  }
  deleteVertex(key: string) {
    if (!this.head) {
      return false;
    }
    if (this.head.key === key) {
      const deleteVertax = this.head;
      this.head = deleteVertax.next;
      return deleteVertax;
    }

    let vertex = this.head;
    while (vertex.next) {
      if (vertex.next?.key === key) {
        vertex.next = vertex.next.next;
        return vertex.next;
      }
      vertex = vertex.next;
    }
  }
  deleteArc(fromKey: string, toKey: string) {
    let fromVertex = this.head;
    while (fromVertex && fromVertex.key !== fromKey) {
      fromVertex = fromVertex.next;
    }
    if (!fromVertex) {
      return false;
    }

    let vertexArc = fromVertex.arc;
    let prevVertexArc = null;
    while (vertexArc) {
      if (vertexArc.destination.key === toKey) {
        if (prevVertexArc) {
          prevVertexArc.next = vertexArc.next;
        } else {
          fromVertex.arc = vertexArc;
        }
        break;
      }
      prevVertexArc = vertexArc;
      vertexArc = vertexArc.next;
    }
  }
  
  get vertexs() {
    const vertexArr = [];
    let vertex = this.head;
    while (vertex) {
      vertexArr.push(vertex);
      vertex = vertex.next;
    }
    return vertexArr;
  }

  private _getVertexRoute(vertex: Vertex, findKey = "", distance = 0, history: String[] = []): VertexRoute | null {
    if (vertex.key === findKey) {
      return { vertex, distance };
    }
    if (history.includes(vertex.key)) {
      return null;
    }
    if (!vertex.arc) {
      return null;
    }
    history.push(vertex.key);
    return {
      vertex,
      distance,
      child: vertex.arcs
        .map((arc) => {
          arc.inTree = true;
          return this._getVertexRoute(
            arc.destination,
            findKey,
            distance + arc.distance,
            [...history]
          );
        })
        .filter((v) => {
          if (!v) {
            return false;
          }
          if (!v.child) {
            return true;
          }
          if (v.child && !v.child.length) {
            return false;
          }
          return true;
        }) as VertexRoute[]
    };
  }
  searchRoute(fromKey: string, toKey: string): VertexRoute | undefined {
    let fromVertex = this.head;

    while (fromVertex) {
      if (fromVertex.key === fromKey) break;
      fromVertex = fromVertex.next;
    }
    if(!fromVertex) {
      return undefined;
    }
    if (fromVertex.key === toKey) {
      return {
        vertex: fromVertex,
        distance: 0
      };
    }
    if (!fromVertex.arc) {
      return {
        vertex: fromVertex,
        distance: 0
      };
    }

    return this._getVertexRoute(fromVertex, toKey) as VertexRoute;
  }
  static routesFlat(vertexRoute: VertexRoute): Exclude<VertexRoute, 'child'>[][] {
    const result = [[]];
    const flat = (arr: VertexRoute[][], i: number, vertexRoute: VertexRoute) => {
      if (vertexRoute.child) {
        if (vertexRoute.child.length === 1) {
          const { child, ...rest } = vertexRoute;
          arr[i].push(rest);
          flat(arr, i, child[0]);
        } else {
          const { child, ...rest } = vertexRoute;
          arr[i].push(rest);
          const originArr = arr[i];
          child.forEach((obj, idx) => {
            const newArr = [...originArr];
            const newIdx = i + idx;
            arr[newIdx] = newArr;
            flat(arr, newIdx, obj);
          });
        }
      } else {
        arr[i].push(vertexRoute);
      }
    };
    flat(result, 0, vertexRoute);
    return result;
  }
}
  
export default Graph;
  