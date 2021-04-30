package ui;

import model.Graph;
import model.Vertex;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;

class Console {

    public Console() {
        // test data
        Vertex cpsc100 = new Vertex("CPSC", "100");
        Vertex cpsc101 = new Vertex("CPSC", "101");
        Vertex cpsc103 = new Vertex("CPSC", "103");
        Vertex cpsc107 = new Vertex("CPSC", "107");
        Vertex cpsc110 = new Vertex("CPSC", "110");
        Vertex cpsc121 = new Vertex("CPSC", "121");

        // add vertices to hashmap
        HashMap <Vertex, LinkedList<Vertex>> data = new HashMap<>();
        data.put(cpsc100, new LinkedList<>());
        data.put(cpsc101, new LinkedList<>());
        data.put(cpsc103, new LinkedList<>());
        data.put(cpsc107, new LinkedList<>());
        data.put(cpsc110, new LinkedList<>());
        data.put(cpsc121, new LinkedList<>());


        Graph g = new Graph(data);

        // instead of addiMng the edges individually, the edges can be put into 'data'
        // rather than passing empty LinkedLists.
        g.addEdge(cpsc107, cpsc103);
        g.addEdge(cpsc107, cpsc121);
        g.addEdge(cpsc110, cpsc121);
        g.addEdge(cpsc121, cpsc107);
        g.addEdge(cpsc121, cpsc110);

        printGraph(g);
    }

    // prints adjacency list of the graph
    public static void printGraph(Graph g) {
        HashMap<Vertex,LinkedList<Vertex>> adjList = g.getAdjList();

        for (Map.Entry<Vertex, LinkedList<Vertex>> v : adjList.entrySet()) {
            System.out.print(v.getKey().toString() + " : ");
            LinkedList<Vertex> edgeList = v.getValue();
            for(Vertex e : edgeList) {
                System.out.print(e.toString() + g.getRelation(v.getKey(), e) + "  ");
            }
            System.out.println();
        }
    }
}
