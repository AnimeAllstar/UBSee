package model;

import java.util.HashMap;
import java.util.LinkedList;

public class Graph {
    private final HashMap<Vertex, LinkedList<Vertex>> adjList;

    // constructor for graph using map
    public Graph(HashMap<Vertex, LinkedList<Vertex>> map) {
        adjList = map;
//        adjList = new HashMap<>();
//        for (HashMap.Entry<Vertex, LinkedList<Vertex>> v : map.entrySet()) {
//            addVertex(v.getKey(), v.getValue());
//        }
    }

    // constructor for empty graph
    public Graph() {
        adjList = new HashMap<>();
    }

    // adds directed edge "key -> e" to graph
    public void addEdge(Vertex key, Vertex e) {
        LinkedList<Vertex> list = getEdgeList(key);
        list.add(e);
    }

    // if 'key' is not a vertex, add key as a vertex
    // return the edgeList of vertex 'key'
    public LinkedList<Vertex> getEdgeList(Vertex key) {
        LinkedList<Vertex> edgeList = adjList.get(key);
        if (edgeList == null) {
            edgeList = new LinkedList<>();
            addVertex(key, edgeList);
        }
        return edgeList;
    }

    // add key to the adjList
    public void addVertex(Vertex key, LinkedList<Vertex> edgeList) {
        adjList.put(key, edgeList);
    }

    // add key to the adjList (empty edgeList)
    public void addVertex(Vertex key) {
        adjList.put(key, new LinkedList<>());
    }

    // return adjList
    public HashMap<Vertex, LinkedList<Vertex>> getAdjList() {
        return adjList;
    }
}
