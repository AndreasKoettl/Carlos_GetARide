<?php

require_once ("error.php");

/**
 * Class DatabaseAccess
 *
 * Represents Connection to database.
 * Operations with the database are only possible via this class.
 * It handles the statements, params, and results from queries.
 * Also returns status/errormessages.
 */
class DatabaseAccess
{
    /**
     * Access values for database connection.
     */
    const SERVERNAME = "localhost";
    const DBNAME = "Carlos_GetARide";
    const USERNAME = "user";
    const PASSWORD = "Carlos_GetARide";

    /**
     * @var PDO
     *
     * PDO Connection to the database.
     */
    private $dbConnection;

    /**
     * @var \PDOStatement
     *
     * Current PDO Statement.
     */
    private $preparedStatement;

    /**
     * @var array
     *
     * Empty result array, will contain data from the database and status/error messages as well.
     * The array is organized as followed:
     *      status: success or error, indicating, if the last operation succeeded or failed.
     *      statusmessage: description, what succeeded or failed the last operation. On error, it will also contain the pdo exception message.
     *      data: array containing the selected datasets from the database.
     */
    private $result = array();

    /**
     * DatabaseAccess constructor.
     *
     * Creates connection to database.
     * A status message will be generated both on success and error.
     */
    public function __construct()
    {
        // Try to create database connection.
        // Set successmessage on succes.
        try {
            $this->dbConnection = new PDO("mysql:host=" . self::SERVERNAME . ";dbname=" . self::DBNAME, self::USERNAME, self::PASSWORD);
            $this->dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $this->result = setSuccessMessage($this->result, "Database connection succcessful.");
        }
        // If something went wrong, set errormessage.
        catch (PDOException $e) {
            $this->result = setErrorMessage($this->result, "Database connection failed: " . $e->getMessage());
        }
    }

    /**
     * Prepares the statement.
     * A status message will be generated both on success and error.
     *
     * @param $statement string A statement to prepare.
     */
    public function prepareStatement($statement)
    {
        // Try to prepare the statement.
        // Set successmessage on success.
        try {
            $this->preparedStatement = $this->dbConnection->prepare($statement);

            $this->result = setSuccessMessage($this->result, "Preparing statement successful.");
        }
        // If something went wrong, set error message.
        catch (PDOException $e) {
            $this->result = setErrorMessage($this->result, "Preparing statement failed: " . $e->getMessage());
        }
    }

    /**
     * Executes the statement.
     * A status message will be generated both on success and error.
     */
    public function executeStatement()
    {
        // Try to execute the statement.
        // Set successmessage on success.
        try {
            $this->preparedStatement->execute();

            $this->result = setSuccessMessage($this->result, "Executing statement successful.");
        }
        // If something went wrong, set error message.
        catch (PDOException $e) {
            $this->result = setErrorMessage($this->result, "Executing statement failed: " . $e->getMessage());
        }
    }

    /**
     * Fetches the result from the last statement.
     * A status message will be generated both on success and error.
     *
     * @return array An array containing the datasets and a statusmessage, or an errormessage.
     */
    public function fetchAll(): array
    {
        // Try fetch result sets.
        // Set statusmessage on success.
        try {
            $this->preparedStatement->setFetchMode(PDO::FETCH_ASSOC);
            $this->result["data"] = $this->preparedStatement->fetchAll();

            $this->result = setSuccessMessage($this->result, "Fetching all successful.");
        }
        catch (PDOException $e) {
            $this->result = setErrorMessage($this->result, "Fetching all failed: " . $e->getMessage());
        }

        return $this->result;
    }

    /**
     * Gets the affected row count from the last statement.
     *
     * @return int The count of affected rows.
     */
    public function getRowCount(): int
    {
        return $this->preparedStatement->rowCount();
    }

    /**
     * Binds a value to a param for the next statement.
     *
     * @param string $paramName Name of the param.
     * @param string $paramValue Value of the param.
     * @param int $dataType
     */
    public function bindParam($paramName, $paramValue, $dataType = PDO::PARAM_STR)
    {
        if ($dataType == PDO::PARAM_INT) {
            $paramValue = (int)$paramValue;
        }
        $this->preparedStatement->bindParam($paramName, $paramValue, $dataType);
    }

    // Gets the current result array.
    // This way we can always check status/errormessages, even if we are not selecting any data from the DB.

    /**
     * Gets the current result array.
     * This way we can always check status/errormessages, even if we are not selecting any data from the DB.
     *
     * @return array An array containing the datasets and a statusmessage, or an errormessage.
     */
    public function getResultArray(): array
    {
        return $this->result;
    }

    /**
     * Starts a new transaction, which can be undone with rollback in case of an error.
     *
     * @return bool True if the transaction was started successfully.
     */
    public function beginTransaction(): bool
    {
        return $this->dbConnection->beginTransaction();
    }

    /**
     * Undos the current transaction, all changes since beginTransaction will be undone,
     * except DROP or TRUNCATE statements.
     *
     * @return bool True if the rollback was successful.
     */
    public function rollback(): bool
    {
        return $this->rollback();
    }

    /**
     * Commits the current transaction, saves all changes made to the database since beginTransaction.
     *
     * @return bool True if the commit was successful.
     */
    public function commit(): bool
    {
        return $this->commit();
    }
}