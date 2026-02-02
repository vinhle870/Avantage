package ProjectContext.custom_Func;

import java.io.IOException;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.Random;

public class Custom_Func {

	public Custom_Func() {
		// TODO Auto-generated constructor stub
	}

	public static NumberFormat formatter = new DecimalFormat("#,000.00");

	public static int randomNumber(){
		Random random = new Random();
		int number = random.nextInt(99999);
		return number;
	}//end void
	
	public static String GetOS_func()
	{//return: mac, win
		String os = System.getProperty("os.name").toLowerCase();
		System.out.println(os);
		return os;
	}//end void
	
	
	public static void MacUploadFile_func(String file_path) throws IOException {

		String exec_str ="";

		exec_str += "tell application \"Firefox\"\n";
		exec_str += "activate \"FireFox\"\n";
		exec_str +="end tell\n";
		exec_str +="tell application \"System Events\"\n";
		exec_str +="keystroke \"G\" using {command down, shift down}\n";
		exec_str +="keystroke \""+file_path+"\"\n";
		//exec_str +="keystroke \"/Users/bigin1/Documents/Agoyu-Automation/AgoyuProj/Data Files/logo4M.jpg\"\n"

		exec_str +="keystroke return\n";
		exec_str +="delay 2\n";
		exec_str +="keystroke return\n";
		exec_str +="delay 2\n";
		exec_str +="end tell\n";

		System.out.println(exec_str);

		String []Run_str = new String[3];

		Run_str[0] = "osascript";
		Run_str[1] = "-e";
		Run_str[2] = exec_str;

		System.out.println ("Start to upload image in MAC");

		Runtime rtime = Runtime.getRuntime();
		rtime.exec(Run_str);

		System.out.println ("Completed to upload image in MAC");

	}//end void
	

}
