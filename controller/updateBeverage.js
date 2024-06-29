const jwt = require("jsonwebtoken");

module.exports = (req, res) => {
    // Check if Authorization header is present
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Authorization header is missing",
        });
    }

    // Split the Authorization header to extract the token
    const token = authHeader.split(" ")[1]; // Assuming token is sent as 'Bearer <token>'

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token is missing",
        });
    }

    // Verify JWT token
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        // Extract user id from decoded token
        const { id } = decodedToken;
		// Parse request body parameters
        const { beverage_id, name, bottle_id, color, visible } = req.body;

        // Validate parameters
        if (!beverage_id || !name) {
            return res.status(400).json({
                success: false,
                message: "Missing data in request body",
            });
        }

        // Query to fetch total_intake from water_stat for the current user and specified date interval
        const sql = `
			UPDATE beverage
				SET name = ?, bottle_id = ?, color = ?, visible = ?
				WHERE beverage_id = ? and user_id = ?;
			`;

        connection.query(sql, [name, bottle_id, color, visible, beverage_id, id], (err, results) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error deleting beverage data",
                    error: err.message,
                });
            }

            if (results.length === 0) {
                return res.status(204).json({
                    success: false,
                    message: "No beverage row found",
                });
            }

            // Return the fetched results
            return res.status(200).json({
                success: true,
                message: "Beverage data deleted successfully",
                data: results,
            });
        });
    });
};
