package com.tempora;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class TaskTest {

    @Test
    public void testTaskConstructor() {
        // create a task with known values
        Task task = new Task(1, "Learn JUnit", "Testing testing testing", Priority.MEDIUM);

        // check that each field holds what we expect
        assertEquals(1, task.getId());
        assertEquals("Learn JUnit", task.getTitle());
        assertEquals("Testing testing testing", task.getDescription());
        assertEquals(Priority.MEDIUM, task.getPriority());
    }
}
