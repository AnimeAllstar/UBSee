package model;

// represents course nodes in the graph
public class Vertex {
    private String dep;
    private String id;

    public Vertex(String dep, String id) {
        this.dep = dep;
        this.id = id;
    }

    public String getDep() {
        return dep;
    }

    public void setDep(String dep) {
        this.dep = dep;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return getDep() + " " + getId();
    }
}
