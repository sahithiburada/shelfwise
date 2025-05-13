<?php
   class Book {
       private $conn;
       private $table_name = "books";

       public $id;
       public $user_id;
       public $title;
       public $author_name;
       public $genre;
       public $description;

       public function __construct($db) {
           $this->conn = $db;
       }

       public function read($offset, $per_page, $sort_by, $sort_order, $user_id = null) {
           $query = "SELECT * FROM " . $this->table_name;
           $params = [];

           if ($user_id !== null) {
               $query .= " WHERE user_id = :user_id";
               $params['user_id'] = $user_id;
           }

           $query .= " ORDER BY " . $sort_by . " " . $sort_order;
           $query .= " LIMIT :offset, :per_page";

           $stmt = $this->conn->prepare($query);

           if ($user_id !== null) {
               $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
           }
           $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
           $stmt->bindParam(':per_page', $per_page, PDO::PARAM_INT);

           $stmt->execute();
           return $stmt;
       }

       public function count($user_id = null) {
           $query = "SELECT COUNT(*) as total FROM " . $this->table_name;
           $params = [];

           if ($user_id !== null) {
               $query .= " WHERE user_id = :user_id";
               $params['user_id'] = $user_id;
           }

           $stmt = $this->conn->prepare($query);

           if ($user_id !== null) {
               $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
           }

           $stmt->execute();
           $row = $stmt->fetch(PDO::FETCH_ASSOC);
           return $row['total'];
       }

       public function create() {
           $query = "INSERT INTO " . $this->table_name . " (user_id, title, author_name, genre, description) VALUES (:user_id, :title, :author_name, :genre, :description)";
           $stmt = $this->conn->prepare($query);

           $stmt->bindParam(':user_id', $this->user_id, PDO::PARAM_INT);
           $stmt->bindParam(':title', $this->title);
           $stmt->bindParam(':author_name', $this->author_name);
           $stmt->bindParam(':genre', $this->genre);
           $stmt->bindParam(':description', $this->description);

           if ($stmt->execute()) {
               return true;
           }
           return false;
       }

       public function update() {
           $query = "UPDATE " . $this->table_name . " SET user_id = :user_id, title = :title, author_name = :author_name, genre = :genre, description = :description WHERE id = :id";
           $stmt = $this->conn->prepare($query);

           $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);
           $stmt->bindParam(':user_id', $this->user_id, PDO::PARAM_INT);
           $stmt->bindParam(':title', $this->title);
           $stmt->bindParam(':author_name', $this->author_name);
           $stmt->bindParam(':genre', $this->genre);
           $stmt->bindParam(':description', $this->description);

           if ($stmt->execute()) {
               return true;
           }
           return false;
       }
   }
   ?>