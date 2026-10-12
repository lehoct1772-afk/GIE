package main
import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
)
type SpatialRequest struct {
	UserID float64   \"json:\"user_id\"\`n	Points []float64 \"json:\"points\"\`n}
type GatewayServer struct {
	mu           sync.Mutex
	activeUsers  map[float64]bool
}
func (s *GatewayServer) handleSpatialCompute(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}
	var req SpatialRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	s.mu.Lock()
	s.activeUsers[req.UserID] = true
	s.mu.Unlock()
	fmt.Printf("[Go Gateway] Processing matrix calculations for User ID: %.0f\n", req.UserID)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(\"{\"status\":\"Data piped to Rust compute core successfully\"}\"))
}
func main() {
	server := &GatewayServer{activeUsers: make(map[float64]bool)}
	http.HandleFunc("/compute", server.handleSpatialCompute)
	fmt.Println("[Go Gateway] Listening on port 8080...")
	http.ListenAndServe(":8080", nil)
}
