package com.tempora;

import com.tempora.db.TaskManager;
import com.tempora.model.Priority;
import com.tempora.model.Status;
import com.tempora.model.Task;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.*;

@Disabled("TaskManager now uses Postgres — these tests need a real DB connection or mocking, tracked separately")
public class TaskManagerTest {

    private static final int TEST_USER_ID = 1;

    @Test
    public void testAddTask() throws SQLException {
        // start with a fresh, empty manager
        TaskManager manager = new TaskManager();
        Task task = new Task(1, "Learn JUnit", "Study testing basics", Priority.HIGH, Status.IN_PROGRESS);
        task.setUserId(TEST_USER_ID);

        manager.addTask(task);

        // the list should now contain exactly one task
        assertEquals(1, manager.getAllTasks(TEST_USER_ID).size());
    }

    @Test
    public void testGetAllTasksReturnsAddedTasks() throws SQLException {
        TaskManager manager = new TaskManager();
        Task task1 = new Task(1, "Task One", "Desc", Priority.LOW, Status.TODO);
        task1.setUserId(TEST_USER_ID);
        Task task2 = new Task(2, "Task Two", "Desc", Priority.MEDIUM, Status.DONE);
        task2.setUserId(TEST_USER_ID);

        manager.addTask(task1);
        manager.addTask(task2);

        // both tasks should be present in the returned list
        assertTrue(manager.getAllTasks(TEST_USER_ID).contains(task1));
        assertTrue(manager.getAllTasks(TEST_USER_ID).contains(task2));
    }

    @Test
    public void testDeleteTask() throws SQLException {
        TaskManager manager = new TaskManager();
        Task task = new Task(1, "Task to delete", "Desc", Priority.HIGH, Status.IN_PROGRESS);
        task.setUserId(TEST_USER_ID);
        manager.addTask(task);

        manager.deleteTask(task.getId(), TEST_USER_ID);

        // after deletion, the task should no longer be in the list
        assertFalse(manager.getAllTasks(TEST_USER_ID).contains(task));
    }

    @Test
    public void testFindByIdReturnsMatchingTask() throws SQLException {
        TaskManager manager = new TaskManager();
        Task task = new Task(1, "Findable task", "Desc", Priority.HIGH, Status.DONE);
        task.setUserId(TEST_USER_ID);
        manager.addTask(task);

        Task found = manager.findById(1, TEST_USER_ID);

        assertEquals(task, found);
    }

    @Test
    public void testFindByIdReturnsNullWhenNotFound() throws SQLException {
        TaskManager manager = new TaskManager();
        Task task = new Task(1, "Some task", "Desc", Priority.LOW, Status.TODO);
        task.setUserId(TEST_USER_ID);
        manager.addTask(task);

        Task found = manager.findById(999, TEST_USER_ID);

        assertNull(found);
    }
}
