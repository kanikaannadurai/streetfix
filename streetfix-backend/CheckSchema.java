import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class CheckSchema {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/streetfix_db?useSSL=false&allowPublicKeyRetrieval=true";
        String user = "root";
        String password = "Akani48";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
            
            ResultSet rs = stmt.executeQuery("DESCRIBE complaints;");
            while (rs.next()) {
                String field = rs.getString("Field");
                String type = rs.getString("Type");
                if ("priority".equalsIgnoreCase(field)) {
                    System.out.println("COLUMN priority type is: " + type);
                }
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
