package ProjectContext.custom_Func;


import java.io.BufferedOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;

import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;

import java.net.URL;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import ProjectContext.dataReader.GlobalConfigsReader;
import core.assertion.TestAssertions;
import core.enums.Failure_Handler;

import org.apache.commons.codec.binary.Base64InputStream;



import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;


import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.pdfbox.text.PDFTextStripperByArea;
public class FileManage {
	
	//public  String file_path = workingDirectory;

	public String File_Name;
	public FileManage() {
		// TODO Auto-generated constructor stub
		File_Name = "";
	}

	/**
	 * Read file such as: .pdf, .docx
	 * @param file_name
	 * Author: Vinh Le
	 */
	public  String getFileContent_func(String file_name) {
		
		String folder_str = "";
		String Content= "";
		File_Name = file_name;
		File f = new File(folder_str+File_Name);
		try {
			
			if(file_name.contains("pdf"))
			{
				return ReadPDFFile_func(File_Name);
			}
		
			else if(file_name.contains("txt"))

			{
				// default UTF_8
				String result = Files.readString(Paths.get(file_name));
				return result;
			}
			else{
				//String folder_str = local_home+File.separator+ Download_foldername+File.separator;
				//1: Creat and connect the data stream
				System.out.println(folder_str+File_Name);

				
				//Grant read file permission
				if(!f.canRead())
				{
					f.setReadable(true);
				}
				
				FileReader fr = new FileReader(f);
				
				FileInputStream fis = new FileInputStream(f);

				XWPFDocument document = new XWPFDocument(fis);

				List<XWPFParagraph> paragraphs = document.getParagraphs();

				for (XWPFParagraph para : paragraphs) {
					String content_str = para.getText();
					Content+=content_str;
				}//for
				document.close();

				fis.close();

				fr.close();
			}


		} catch (Exception e) {

			TestAssertions.markStepFailed("Failure When trying to read the file\n", Failure_Handler.STOP_RUN);
		}

		return Content;
	}

	private String ReadPDFFile_func(String file_name)
	{
		String Content= "";
		//1: Creat and connect the data stream
		String folder_str = "";
		//1: Creat and connect the data stream

		File f = new File(folder_str+file_name);

		 PDDocument document;
		try {
			document = PDDocument.load(f);

			 if (!document.isEncrypted()) {

	                PDFTextStripperByArea stripper = new PDFTextStripperByArea();
	                stripper.setSortByPosition(true);

	                PDFTextStripper tStripper = new PDFTextStripper();

	                String pdfFileInText = tStripper.getText(document);
	                //System.out.println("Text:" + pdfFileInText);

					// split by whitespace
	                String lines[] = pdfFileInText.split("\\r?\\n");

	                for (String line : lines) {

	                	Content+=line;
	                	Content+="\n";

	                }//end for

				 System.out.println(Content);

	      }//end if
			document.close();

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Content;

}//end void
	
	public  void CreateWordFile_func(String file_name,String content_str)
	{
		try {
		//Blank Document

		String[] lines = content_str.split("\n");

		int count = lines.length;

		XWPFDocument document = new XWPFDocument();
		//Write the Document in file system
		FileOutputStream out;
		
		out = new FileOutputStream(new File(GlobalConfigsReader.getInstance().getTestFileDownloadUrl()+file_name));
		
		XWPFParagraph paragraph = document.createParagraph();

		//create Paragraph
		for(int i = 0;i<count;i++)
		{
			XWPFRun run = paragraph.createRun();
			run.setText(lines[i]);
			run.addBreak();

		}

		document.write(out);
		//Close document
		document.close();
		out.close();
		System.out.println(file_name + " written successfully");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	
	 //METHOD: SAVE FILE FROM URL GET FROM ELEMENT HYPERLINK / DOWNLOAD BUTTON
	 public  void SaveFileFromURL_func(String filename, String url)
	 {
		 try {
		 File new_file = new File(GlobalConfigsReader.getInstance().getTestFileDownloadUrl()+filename);
	 
	 URL new_url;
	
		new_url = new URL(url);
	
	 
	 System.setProperty("http.agent", "Chrome");
	 
	 HttpURLConnection http_connect = (HttpURLConnection) new_url.openConnection();
	 
	 http_connect.connect();
	 
	 InputStream input_stream = (InputStream) new_url.openStream();
	 //new_url.get
	
	 System.out.println(new_url.getContent());
	
	 Base64InputStream data_buff = new Base64InputStream(input_stream)	;
	 
	 DataOutputStream output = new DataOutputStream( new BufferedOutputStream(new FileOutputStream(new_file)));
	 
	 byte[] buffer = new byte[1024];
	 
	 int bytesRead;
	
	 while ((bytesRead = data_buff.read(buffer)) != -1) {
	
	System.out.println(bytesRead);
	
	output.write(buffer, 0, bytesRead);
	 }//end while
	
	 output.close();
	 http_connect.disconnect();
	 
	 } catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	 }//end void
	 
	 /*
	 public void SavefileTxt(String filename, String url)
	 {
	 File new_file = new File(this.file_path+filename);

	 URL new_url = new URL(url);

	 System.setProperty("http.agent", "Chrome");

	 HttpURLConnection http_connect = (HttpURLConnection) new_url.openConnection();

	 http_connect.connect();

	 InputStream input_stream = (InputStream) new_url.openStream();

	 //FileUtils.Copy(input_stream, new_file)

	 FileUtils.copyURLToFile(new_url, new_file);

	 http_connect.disconnect();

	 WebDriver webDriver = TestConfigs.glb_webdriver;

	 webDriver.get("about:config");

	 String name  = "browser.download.useDownloadDir";

	 String value = "false";
	 //webDriver.execute_script()

	 ((JavascriptExecutor) webDriver).executeScript("""var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);prefs.setBoolPref(arguments[0], arguments[1]);""", name, value);

	 PageObjects.Optimize_ElementClick(null);

	 }
*/

	public  void Delete_File_func(String path_folder_str, String file_name){
	
		String full_path_file = path_folder_str+File.separator+file_name;
		
		File myObj = new File(full_path_file); 
	    
		if (myObj.delete()) { 
	      System.out.println("Deleted the file: " + myObj.getName());
	   
		} else {
	      System.out.println("Failed to delete the file.");
	    } 
	}//end void
	
	public  void Delete_Downloaded_File_func(String file_name)
	{
		//Delete_File_func(GlobalConfigsReader.Download_full_folder_path,file_name);
	}

}
