package core.assertion;

import core.enums.Failure_Handler;
import org.assertj.core.api.SoftAssertions;

public class TestAssertions {

    private static SoftAssertions softAssertions = new SoftAssertions();

    public static void markStepFailed(String failure_msg, Failure_Handler failureHandler) {
        softAssertions.fail(failure_msg);

        switch (failureHandler) {
            case STOP_RUN:
                softAssertions.assertAll();
                break;
            case CONTINUE_RUN:
                // continue without asserting immediately
                break;
        }
    }

    public static void markTCFailed() {
        softAssertions.assertAll();
    }

    public static void compareStringEquals(String actual_content,String expect_content,String failed_msg)
    {
       if(!actual_content.contains(expect_content))
        {
            TestAssertions.markStepFailed(failed_msg+ " Due to: failure Comparing Actual Content["+actual_content+"] Content [Expected Content: "+expect_content+"] \n", Failure_Handler.STOP_RUN);

        }//if
    }

    public static void CheckResultCondition(String result,String failed_msg)
    {
        if(!result.equals(""))
        {
            TestAssertions.markStepFailed(failed_msg+ " Due to: " + result + " is not correct. ", Failure_Handler.STOP_RUN);
        }
    }

    public static void resetAssertion()
    {
        softAssertions = new SoftAssertions();
    }
}
