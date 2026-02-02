package ProjectContext.dataReader;

import java.io.FileInputStream;
import java.util.Properties;

import java.io.IOException;
import java.io.InputStream;



public class ProptiesReader {

	public Properties property_var ;
	

	public ProptiesReader() {
		// TODO Auto-generated constructor stub
		property_var = new Properties();
	}
	
	//To load properties from a specific .properties file
	public void LoadPropertyFile(String filename_arg)
	{
		InputStream input = null;
		Properties prop = new Properties();
		String temp_filename = filename_arg;
		System.out.println("Properties file's content: "+temp_filename);
		try {
			
			//input = getClass().getResourceAsStream(temp_filename);
			input = new FileInputStream(filename_arg);
			// load a properties file
			prop.load(input);
			this.property_var = prop;
			System.out.println("Properties file's content: "+this.property_var.toString());
			}//try 
		catch (IOException ex) {
			ex.printStackTrace();
		}//catch 
		
		finally {
			if (input != null) {
				try {
					input.close();
				}//try 
				catch (IOException e) {
					e.printStackTrace();
				}//catch
			}//if
		}//finally
	}//void
}
