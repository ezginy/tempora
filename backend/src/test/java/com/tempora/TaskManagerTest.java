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

    @Test
    public void testAddTask() throws SQLException {
        // start with a fresh, empty manager
        TaskManager manager = new TaskManager();
        Task task = new Task(1, "Learn JUnit", "Study testing basics", Priority.HIGH, Status.IN_PROGRESS);

        manager.addTask(task);

        // the list should now contain exactly one task
        assertEquals(1, manager.getAllTasks().size());
    }

    @Test
    public void testGetAllTasksReturnsAddedTasks() throws SQLException {
        TaskManager manager = new TaskManager();
        Task task1 = new Task(1, "Task One", "Desc", Priority.LOW, Status.TODO);
        Task task2 = new Task(2, "Task Two", "Desc", Priority.MEDIUM, Status.DONE);

        manager.addTask(task1);
        manager.addTask(task2);

        // both tasks should be present in the returned list
        assertTrue(manager.getAllTasks().contains(task1));
        assertTrue(manager.getAllTasks().contains(task2));
    }

    @Test
    public void testDeleteTask() throws SQLException {
        TaskManager manager = new TaskManager();
        Task task = new Task(1, "Task to delete", "Desc", Priority.HIGH, Status.IN_PROGRESS);
        manager.addTask(task);

        manager.deleteTask(task.getId());

        // after deletion, the task should no longer be in the list
        assertFalse(manager.getAllTasks().contains(task));
    }

    @Test
    public void testFindByIdReturnsMatchingTask() throws SQLException {
        TaskManager manager = new TaskManager();
        Task task = new Task(1, "Findable task", "Desc", Priority.HIGH, Status.DONE);
        manager.addTask(task);

        Task found = manager.findById(1);

        assertEquals(task, found);
    }

    @Test
    public void testFindByIdReturnsNullWhenNotFound() throws SQLException {
        TaskManager manager = new TaskManager();
        manager.addTask(new Task(1, "Some task", "Desc", Priority.LOW, Status.TODO));

        Task found = manager.findById(999);

        assertNull(found);
    }
}
