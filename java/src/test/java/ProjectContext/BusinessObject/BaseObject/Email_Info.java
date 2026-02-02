/*
package ProjectContext.BusinessObject.BaseObject;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import java.util.Random;

import custom_Func.DateTime_Manage;
import custom_Func.FileManage;
import dataReader.EnvInfoReader;

public class Email_Info{
	public String Type;
	public String EmailAddr;

	//To send email
	
	public String ServiceType;
	public String Order_Descr;
	public String RecipientType;
	public String TemplateName;
	public List<String> To_list;
	public List<String> CC_list;
	public List<String> BCC_list;
	public String From;
	public String Subject;
	public String Content;
	public List<String> Attach_List = new ArrayList<String>();

	//FOR RECEIVED MAIL
	public String activatelink;
	public String resetlink;
	public Date sentDate;
	public List<FileManage> download_files;

	public Email_Info() {
		// TODO Auto-generated constructor stub
		Random r = new Random();
		int ret2 = r.nextInt(100)+1;
		int ret = r.nextInt(100)+1;
		String addr = "test_mail"+ DateTime_Manage.getCurrentLocalTime()+Integer.toString(ret+ret2);
		Type = "Work Email";
		EmailAddr = addr+"@yopmail.com";
		ServiceType = "";
		RecipientType = "";

		TemplateName = "";
		To_list = new ArrayList<>();
		To_list.add(EnvInfoReader.glb_TestMailAccount);

		CC_list = new ArrayList<>();
		BCC_list = new ArrayList<>();
		From = EnvInfoReader.glb_EmailSender;
		Subject = "";
		Content ="";
		Attach_List = new ArrayList<>();

		//FOR RECEIVED EMAIL
		sentDate = DateTime_Manage.GetLocalDatetime();
				
		download_files = new ArrayList<>();
		
		Order_Descr="";
	}
		
		
	
}
*/
