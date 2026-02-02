package core.helper;

import java.awt.*;
import java.awt.datatransfer.Clipboard;
import java.awt.datatransfer.StringSelection;
import java.awt.event.KeyEvent;
import java.awt.Robot;
public class BrowserHelper {

    public static void saveSourcePage(String filename)
    {

        Clipboard clipboard = Toolkit.getDefaultToolkit().getSystemClipboard();

        //StringSelection string_slect = new StringSelection(GlobalConfigsReader.test_data_full_path+file_name);
        StringSelection string_slect = new StringSelection(filename);

        clipboard.setContents(string_slect, string_slect);

        DownloadFile_func();

    }

    private static void DownloadFile_func()
    {
        try {

            Thread.sleep(2000);

             Robot rbot  = new Robot();

             //Control + S
            rbot.keyPress(KeyEvent.VK_CONTROL);
            rbot.keyPress(KeyEvent.VK_S);
            Thread.sleep(2000);

            rbot.keyRelease(KeyEvent.VK_S);
            rbot.keyRelease(KeyEvent.VK_CONTROL);

            //SELECT OPTION SAVE FILE
            /*
            rbot.keyPress(KeyEvent.VK_ALT);
            rbot.keyPress(KeyEvent.VK_S);
            Thread.sleep(2000);

            rbot.keyRelease(KeyEvent.VK_S);
            rbot.keyRelease(KeyEvent.VK_ALT);

            Thread.sleep(2000);
            rbot.keyPress(KeyEvent.VK_ENTER);
            rbot.keyRelease(KeyEvent.VK_ENTER);
            Thread.sleep(1000);
            */
            rbot.keyPress(KeyEvent.VK_CONTROL);
            rbot.keyPress(KeyEvent.VK_V);
            Thread.sleep(1000);
            rbot.keyRelease(KeyEvent.VK_V);
            rbot.keyRelease(KeyEvent.VK_CONTROL);
            Thread.sleep(2000);

            rbot.keyPress(KeyEvent.VK_ENTER);
            rbot.keyRelease(KeyEvent.VK_ENTER);
            Thread.sleep(2000);

        }//try
        catch (AWTException | InterruptedException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }//catch


    }//void

}
