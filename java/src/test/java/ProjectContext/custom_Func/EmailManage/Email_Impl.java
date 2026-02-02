/*
package ProjectContext.custom_Func.EmailManage;

import java.io.BufferedOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.Random;

import javax.mail.Address;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.NoSuchProviderException;
import javax.mail.Part;
import javax.mail.Session;
import javax.mail.Store;

import org.junit.jupiter.api.Assertions;;

import businessObjects.BaseObject.Email;
import dataReader.GlobalConfigsReader;

import custom_Func.DateTime_Manage;
import custom_Func.FileManage;
import dataReader.EnvInfoReader;

public class Email_Impl implements Email{
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

	public Email_Impl() {
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
	
		//METHOD FOR RECEIVED EMAIL
		public void GetActivateLink()
		{
			//<a href="https://agoyu-dev.bigin.top/auth/activate/6/5BlMOqMItoOw5008NfgQkt0Pb4Jiqrf0" style="color: #ffffff; text-decoration: none;">Active your email
			String temp_1 ="" ;// GlobalConfigsReader.glb_URL+ "/auth/activate";
			String temp_2 = "Active your email";

			int index_1 = this.Content.indexOf(temp_1);
			int index_2 = this.Content.indexOf(temp_2);

			String temp_str =  this.Content.substring(index_1, index_2);


			temp_str = temp_str.replace("<a href=\"","");
			temp_str = temp_str.replace("\"","");
			temp_str = temp_str.replace("<a href=\"","");
			temp_str = temp_str.replace("\"","");

			//OR can use this regex temp_str = temp_str.replaceAll(" style.+\$","")
			int index3 =  temp_str.indexOf(" style");
			temp_str =  temp_str.substring(0, index3);
			this.activatelink = temp_str;

		}


		public void GetResetPassLink()
		{
			//<a href="https://agoyu-dev.bigin.top/auth/activate/6/5BlMOqMItoOw5008NfgQkt0Pb4Jiqrf0" style="color: #ffffff; text-decoration: none;">Active your email
			String temp_1 = "";//GlobalConfigsReader.glb_URL+ "/auth/reset";
			String temp_2 = "Reset Your Password";

			int index_1 = this.Content.indexOf(temp_1);
			int index_2 = this.Content.indexOf(temp_2);

			String temp_str =  this.Content.substring(index_1, index_2);


			temp_str = temp_str.replace("<a href=\"","");
			temp_str = temp_str.replace("\"","");
			temp_str = temp_str.replace("<a href=\"","");
			temp_str = temp_str.replace("\"","");
			//OR can use this regex temp_str = temp_str.replaceAll(" style.+\$","")
			int index3 =  temp_str.indexOf(" style");
			temp_str =  temp_str.substring(0, index3);
			this.activatelink = temp_str;

		}

		public void VerifyActivateEmail()
		{

			String heading_content = "Agoyu Confirmation";

			String body_content = "In order to finish your registration you need to confirm your email address. It's easy - just click the Confirm Your Email link below.";

			String active_lnk = "";//GlobalConfigsReader.glb_URL+ "/auth/activate";

			String active_lbl ="Active your email";


			if(!this.Content.contains(heading_content))
			{
				GlobalConfigsReader.glb_TCStatus = false;
				GlobalConfigsReader.glb_TCFailedMessage += "Incorrect Confirmation text.[Observed:"+this.Content +"-Expected:"+heading_content+"].";
			}

			if(!this.Content.contains(body_content))
			{
				GlobalConfigsReader.glb_TCStatus = false;
				GlobalConfigsReader.glb_TCFailedMessage += "Incorrect main text.[Observed:"+this.Content +"-Expected:"+body_content+"].";
			}

			if(!this.Content.contains(active_lnk))
			{
				GlobalConfigsReader.glb_TCStatus = false;
				GlobalConfigsReader.glb_TCFailedMessage += "Incorrect Activate link.[Observed:"+this.Content +"-Expected:"+active_lnk+"].";
			}


			if(!this.Content.contains(active_lbl))
			{
				GlobalConfigsReader.glb_TCStatus = false;
				GlobalConfigsReader.glb_TCFailedMessage += "Incorrect Activate text.[Observed:"+this.Content +"-Expected:"+active_lbl+"].";
			}

		}

		public void VerifyWelcomeEmail()
		{

			String heading_content = "Congratulations!";

			String body_content = "You�re now part of a community that connects regular people like you and me, with the world�s most recognized moving companies across the world. Find a moving estimate that suits your budget. And discover techniques to save money during the process.";


			if(!this.Content.contains(heading_content))
			{
				GlobalConfigsReader.glb_TCStatus = false;
				GlobalConfigsReader.glb_TCFailedMessage = "Incorrect Welcome text.[Observed:"+this.Content +"-Expected:"+heading_content+"].";
			}

			if(!this.Content.contains(body_content))
			{
				GlobalConfigsReader.glb_TCStatus = false;
				GlobalConfigsReader.glb_TCFailedMessage = "Incorrect main text.[Observed:"+this.Content +"-Expected:"+body_content+"].";
			}


		}


		public void Init_ResetPassword_Email_Info(String portal_url)
		{
			this.From = EnvInfoReader.SupportEmail;
			
			this.Subject = "Reset your account password.";
						
			this.Content  = "A password reset has been requested for your ARC portal account. Please click on link below to update your password:";

		
		}//end void


		public void VerifyContentEmail(Email_Impl expect_compare_mail,String emailcontent_operator)
		{
			if(emailcontent_operator.equals("Equals")&&!this.Content.equals(expect_compare_mail.Content))
			{
				GlobalConfigsReader.glb_TCStatus = false;
				GlobalConfigsReader.glb_TCFailedMessage += "Incorrect Email Content.[Observed:"+this.Content +"-Expected:"+expect_compare_mail.Content+"].";

			}
			
			else if(emailcontent_operator.equals("Contains")&&!this.Content.contains(expect_compare_mail.Content))
			{
				GlobalConfigsReader.glb_TCStatus = false;
				GlobalConfigsReader.glb_TCFailedMessage += "Incorrect Email Content.[Observed:"+this.Content +"-Expected:"+expect_compare_mail.Content+"].";

			}
		}

		public void VerifyAttachmentContent_func(String expect_content)
		{
			for(int i =0;i<download_files.size();i++)
			{
				if(!expect_content.equals(""))
				{
					String download_file_content = download_files.get(i).Content.trim();
					if(!download_file_content.equals(expect_content))
					{
						GlobalConfigsReader.glb_TCStatus = false;
						GlobalConfigsReader.glb_TCFailedMessage += "Incorrect Attachment["+download_files.get(i).File_Name+"] Content.[Observed:"+download_files.get(i).Content +"-Expected:"+expect_content+"].";

					}//end if download_file
				}//end expect.content.equal
				
			}//end for
			
			
		}//end void
		
		private String OptimizeEmailContent(String input_str) {
			//input_str = input_str.replace("\n\n","\n")

			int i = input_str.indexOf("<html xmlns:");

			String a;
			if(i>0)
				a = input_str.substring(0,i);
			else
				a = input_str;
			*/
/*
			a = a.replaceAll("</a>", "");
			a = a.replaceAll("</td>", "");
			a = a.replaceAll("</tr>", "");
			a = a.replaceAll("</tbody>", "");
			a = a.replaceAll("</table>", "");
			a = a.replaceAll("</title>", "");
			a = a.replaceAll("</style>", "");
			a = a.replaceAll("</head>", "");
			a = a.replaceAll("</body>", "");
			a = a.replaceAll("</html>", "");
			a = a.replaceAll("</div>", "");
			a = a.replaceAll("</i>", "");
			a = a.replaceAll("</span>", "");
			a = a.replaceAll("</p>", "");
			a = a.replaceAll("</h2>", "");
			a = a.replaceAll("</em>", "");
			a = a.replaceAll("</strong>", "");
			a = a.replaceAll("<i>", "");
			a = a.replaceAll("<strong>", "");
			a = a.replaceAll("<td.+", "");
			a = a.replaceAll("<td.+?>", "");
			a = a.replaceAll("<tr.+", "");
			a = a.replaceAll("<tr.+?>", "");
			a = a.replaceAll("<tbody.+", "");
			a = a.replaceAll("<table.+>", "");

			a = a.replaceAll("<style.+", "");
			a = a.replaceAll("style.+>", "");
			a = a.replaceAll("<span.+>", "");
			a = a.replaceAll("<title.+","");
			a = a.replaceAll("<head.+", "");
			a = a.replaceAll("<div.+", "");
			a = a.replaceAll("<p.+>", "");
			a = a.replaceAll("<p>", "");
			a = a.replaceAll("<br.+", "");
			a = a.replaceAll("<h2.+>", "");
			a = a.replaceAll("&nbsp;", "");

			a = a.replaceAll("<body.+", "");
			a = a.replaceAll("<html.+", "");
			a = a.replaceAll("<link.+>", "");


			a = a.replaceAll(".+word-break.+}", "");
			a = a.replaceAll("word-break.+}", "");
			a = a.replace("<!-- Start Nav -->", "");
			a = a.replaceAll("body.+", "");
			a = a.replaceAll(".+html.+", "");
			a = a.replaceAll(".+?}", "");
			a = a.replaceAll("<base.+", "");
			a = a.replaceAll("td[class].+", "");
			a = a.replaceAll("<img src=\"https://u10082166.+", "");
			a = a.replaceAll("<meta.+", "");
			a = a.replaceAll(" {2,50}", "");

			a = a.replaceAll("}\\s", "");
			a = a.replaceAll("\\s}", "");
			a = a.replaceAll("\n\\s+", "");
	*//*

			a = a.replaceAll("<br[^>]*>", "\n");
			a = a.replaceAll("<[^>]*>", "");
			
			System.out.println("Email Content after optimized:"+a);

			return a;

		}

		
		public void FetchEmail_func(long millis) {
			try {
			Thread.sleep(millis);			
				// create properties field
				Properties properties = new Properties();

				properties.put("mail.imap.host", this.host);
				properties.put("mail.imap.port", this.port);
				properties.put("mail.imap.starttls.enable", "true");
				properties.put("mail.imap.ssl.trust", "true");
				Session emailSession = Session.getDefaultInstance(properties);

				//create the POP3 store object and connect with the pop server
				Store  store = emailSession.getStore(pop3_type);

				System.out.println("------------\nStart to Login Email with Info:\nAccount: "+username+"\nPassword: "+password+"\n-----------");

				
				store.connect(host, username, password);


				// create the folder object and open it
				Folder emailFolder = store.getFolder("INBOX");
				emailFolder.open(Folder.READ_ONLY);

				// retrieve the messages from the folder in an array and print it
				Message[] messages = emailFolder.getMessages();

				for (int i = 0; i < messages.length; i++) {
					Email_Impl tmpmail = new Email_Impl();

					Message message = messages[i];
					tmpmail.sentDate = message.getSentDate();

					List<String> from_tmp = GetAddressFrom(message);
					tmpmail.From =  from_tmp.get(0);

					tmpmail.To_list =   GetAddressTo(message);

					tmpmail.Subject =   GetSubject(message);

					tmpmail.Content = writePart(message);

					tmpmail.Content = OptimizeEmailContent(tmpmail.Content).trim();

					System.out.println("Email Content: "+tmpmail.Content);
					
					tmpmail.download_files.add(mail_attachment_temp);
					
					System.out.println("Attachment '"+mail_attachment_temp.File_Name+"': "+mail_attachment_temp.Content);
					
					Maillist.add(tmpmail);
				}//end for
				System.out.println("Message length:"+messages.length);


			} catch (NoSuchProviderException e) {

				e.printStackTrace();

				GlobalConfigsReader.glb_TCFailedMessage+= e.getMessage();
				Assert.fail(GlobalConfigsReader.glb_TCFailedMessage);
			} catch (MessagingException e) {
				e.printStackTrace();
				GlobalConfigsReader.glb_TCFailedMessage+= e.getMessage();
				Assert.fail(GlobalConfigsReader.glb_TCFailedMessage);
			} catch (IOException e) {
				e.printStackTrace();
				GlobalConfigsReader.glb_TCFailedMessage+= e.getMessage();
				Assert.fail(GlobalConfigsReader.glb_TCFailedMessage);
			} catch (Exception e) {
				e.printStackTrace();
				GlobalConfigsReader.glb_TCFailedMessage+= e.getMessage();
				Assert.fail(GlobalConfigsReader.glb_TCFailedMessage);
			}

			//System.out.println(Maillist.get(0).Content)
		}

		private String writePart(Part p) throws Exception {

			String temp_content = "";
			byte[] bArray = null;
			//check if the content is plain text
			if (p.isMimeType("text/plain")) {

				temp_content += (String) p.getContent();
			}

			//check if the content has attachment
			else if (p.isMimeType("multipart/*")) {
				Multipart mp = (Multipart) p.getContent();
				int count = mp.getCount();
				System.out.println("MultiPart count:"+count);
				for (int i = 0; i < count; i++)
					temp_content +=writePart(mp.getBodyPart(i));
			}
			//check if the content is a nested message
			else if (p.isMimeType("message/rfc822")) {

				temp_content +=writePart((Part) p.getContent());
			}
			//check if the content is an inline image
			else if (p.isMimeType("image/jpeg")) {

				Object o = p.getContent();

				InputStream x = (InputStream) o;
				while (((int) ((InputStream) x).available()) > 0) {
					bArray = new byte[x.available()];
					int result = (int) (((InputStream) x).read(bArray));
					if (result == -1) {
					}
					break;

				}//while
				FileOutputStream f2 = new FileOutputStream("/tmp/image.jpg");
				f2.write(bArray);
				x.close();
				f2.close();
			} // end if (p.isMimeType("image/jpeg")) 
			else if (p.getContentType().contains("image/")) {


				//===download attachment
				System.out.println("content type" + p.getContentType());
				String file_name = "image" + new Date().getTime() + ".jpg";

				this.DownloadAttachment_func(p,file_name);
			}//end if (p.getContentType().contains("image/"))
			else {
				System.out.println("Start to get content of Attachment:");
				Object o = p.getContent();
				System.out.println("Attachment File Name:"+p.getFileName());
				System.out.println("File Type:"+p.getContentType());
				System.out.println("File Content:"+p.getContent());
				if (o instanceof String) {

					temp_content +=(String) o;
				}// end if (o instanceof String) 
				else if (o instanceof InputStream) {
					//==================
					InputStream is = (InputStream) o;
					//int c;

					String file_name  = "Expected_" + p.getFileName();
					this.DownloadAttachment_func(p,file_name);
					
					//Save the content of the attachment into the FileManage
					this.mail_attachment_temp = new FileManage();
									
					this.mail_attachment_temp.File_Name = file_name;
					
					this.mail_attachment_temp.ReadFileContent_func(mail_attachment_temp.File_Name);
					
					is.close();
				}// end if (o instanceof InputStream)
				else {
					temp_content += o.toString();
				}
			}

			//System.out.println(temp_content)
			return temp_content;
		}



		*/
/*
		 * This method would print FROM,TO and SUBJECT of the message
		 *//*

		
		
		
		private  List<String> GetAddressFrom(Message m) throws Exception {
			List<String> temp_addr = new ArrayList<>();
			Address[] a;

			// FROM
			if ((a = m.getFrom()) != null) {
				for (int j = 0; j < a.length; j++)
					temp_addr.add(a[j].toString());
			}
			return temp_addr;

		}


		private  List<String> GetAddressTo(Message m) throws Exception {

			List<String> temp_addr = new ArrayList<>();

			Address[] a;

			// TO
			if ((a = m.getRecipients(Message.RecipientType.TO)) != null) {
				for (int j = 0; j < a.length; j++)
					temp_addr.add(a[j].toString());
			}

			return temp_addr;


		}

		private  String GetSubject(Message m) throws Exception {

			// SUBJECT
			String tmp_subj = "";
			if (m.getSubject() != null);
				tmp_subj = m.getSubject();

			return tmp_subj;

		}

		public void VerifyEmailExist(Email_Impl email, String emailtype)
		{
			//**NOTE: 
			//Value list of emailtype = "Activate" | "Welcome" | ""Reset""
			//Mail_Info email_var = email;

			int count = this.Maillist.size();

			if(count==0)
			{
				GlobalConfigsReader.glb_TCStatus = false;
				GlobalConfigsReader.glb_TCFailedMessage += "Mail box is empty.";
				return;
			}

			Email_Impl resultmail = this.FindExistEmail(email);

			if(resultmail==null)
			{
				GlobalConfigsReader.glb_TCStatus = false;
				GlobalConfigsReader.glb_TCFailedMessage += "No "+emailtype+" email sent from Agoyu System.";
			}

			else
			{
				//System.out.println(mtemp.Content)

				if(emailtype == "Activate")
					resultmail.VerifyActivateEmail();

				else if(emailtype == "Welcome")
					resultmail.VerifyWelcomeEmail();

			}

		}



		private Email_Impl GetEmailContent(Email_Impl expect_email)
		{
			Email_Impl expect_email_var = expect_email;
					
			int count = Maillist.size();

			if(count==0)
			{
				return null;
			}
			for(int i =0;i<count;i++)
			{
				Email_Impl mtemp = Maillist.get (i);
				System.out.println("From Info:"+expect_email_var.From+" - "+mtemp.From);
				System.out.println("Subject: "+expect_email_var.Subject+"-"+mtemp.Subject);
				System.out.println("Email Content: "+expect_email_var.Content+"-"+mtemp.Content);
				System.out.println("Expected Month: "+expect_email_var.sentDate.getMonth()+"-Fetched Month: "+mtemp.sentDate.getMonth());
				System.out.println("Expected Date: "+expect_email_var.sentDate.getDate()+"-Fetched Date: "+mtemp.sentDate.getDate());
				System.out.println("Expected Hour: "+expect_email_var.sentDate.getHours()+"- Fetched Hour: "+mtemp.sentDate.getHours());
				System.out.println("Expected Minutes :"+expect_email_var.sentDate.getMinutes()+"-Fetched Minutes: "+mtemp.sentDate.getMinutes());

				if(mtemp.From.contains(expect_email_var.From)
				&& mtemp.Subject.contains(expect_email_var.Subject)
				&& mtemp.Content.contains(expect_email_var.Content)
				&&(expect_email_var.sentDate.getMonth()==mtemp.sentDate.getMonth())
				&&(expect_email_var.sentDate.getDate()==mtemp.sentDate.getDate())
				&&(expect_email_var.sentDate.getHours()==mtemp.sentDate.getHours())
				&&(Math.abs(expect_email_var.sentDate.getMinutes()-mtemp.sentDate.getMinutes())<4)
				)
				{
					expect_email_var = mtemp;
					break;
				}

			}//end for

			return expect_email_var;
		}


		public Email_Impl FindExistEmail(Email_Impl expect_email)
		{
			long mail_waitime = 30000;
			Email_Impl email_index = null;
			int count = Maillist.size();

			if(count==0)
			{
				return email_index;
			}

			email_index = GetEmailContent(expect_email);
			
			//Re-Fetch email in 3 times
			for(int i =0;i<2;i++)
			{
				if(email_index==null)
				{
					mail_waitime = mail_waitime/(i+1);
					
					FetchEmail_func(mail_waitime);
					
					email_index = GetEmailContent(expect_email);

				}	
				else
				{
					break;
				}
			}
			
		return email_index;
		}


		//==METHOD: DOWNLOAD ATTACHMENT
		public void DownloadAttachment_func(Part p,String file_name)
		{
			try {
				String full_file_path = GlobalConfigsReader.Download_full_folder_path+File.separator+file_name;
			File f = new File(full_file_path);
			DataOutputStream output;
			
			output = new DataOutputStream(	new BufferedOutputStream(new FileOutputStream(f)));
			
			com.sun.mail.util.BASE64DecoderStream test = (com.sun.mail.util.BASE64DecoderStream) p.getContent();
			byte[] buffer = new byte[1024];
			int bytesRead;
			while ((bytesRead = test.read(buffer)) != -1) {
				output.write(buffer, 0, bytesRead);

			}
			output.close();
			} catch (IOException | MessagingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}		
		
	
}
*/
