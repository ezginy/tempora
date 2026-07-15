package com.tempora;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class TaskManagerTest {

    @Test
    public void testAddTask() {
        // start with a fresh, empty manager
        TaskManager manager = new TaskManager();
        Task task = new Task(1, "Learn JUnit", "Study testing basics", Priority.HIGH);

        manager.addTask(task);

        // the list should now contain exactly one task
        assertEquals(1, manager.getAllTasks().size());
    }

    @Test
    public void testGetAllTasksReturnsAddedTasks() {
        TaskManager manager = new TaskManager();
        Task task1 = new Task(1, "Task One", "Desc", Priority.LOW);
        Task task2 = new Task(2, "Task Two", "Desc", Priority.MEDIUM);

        manager.addTask(task1);
        manager.addTask(task2);

        // both tasks should be present in the returned list
        assertTrue(manager.getAllTasks().contains(task1));
        assertTrue(manager.getAllTasks().contains(task2));
    }

    @Test
    public void testDeleteTask() {
        TaskManager manager = new TaskManager();
        Task task = new Task(1, "Task to delete", "Desc", Priority.HIGH);
        manager.addTask(task);

        manager.deleteTask(task);

        // after deletion, the task should no longer be in the list
        assertFalse(manager.getAllTasks().contains(task));
    }
}
