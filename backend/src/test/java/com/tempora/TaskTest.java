package com.tempora;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class TaskTest {

    @Test
    public void testTaskConstructor() {
        // create a task with known values
        Task task = new Task(1, "Learn JUnit", "Testing testing testing", Priority.MEDIUM, Status.TODO);

        // check that each field holds what we expect
        assertEquals(1, task.getId());
        assertEquals("Wrong title", task.getTitle());
        assertEquals("Testing testing testing", task.getDescription());
        assertEquals(Priority.MEDIUM, task.getPriority());
    }

    @Test
    public void testTaskWithBlankTitleIsInvalid() {
        Task task = new Task(1, " ", "Desc", Priority.LOW, Status.IN_PROGRESS);
        assertFalse(task.isValid());
    }

    @Test
    public void testTaskWithValidTitleIsValid() {
        Task task = new Task(1, "Real title", "Desc", Priority.LOW, Status.DONE);
        assertTrue(task.isValid());
    }
}
