package ProjectContext.custom_Func;

import java.sql.DriverManager;

import java.sql.SQLException;
import java.sql.Connection;

import java.sql.Statement;



import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;


import java.io.File;

public class DataBaseManage {
	
	private String sshhostname;
	private String sshlogin;
	private String sshpassword;
	private int SshPort;// remote SSH host port number;
	public Session session;

	private int Localport;
	private int DbRemotePort; // remote port number of your database
	private String DbUser;// database loging username
	private String DbPassword;// database login password
	private String DbBHost;
	private String driverName;
	public Statement stmt;
	private Connection conn;
	private String connection_string;
	private String privatekey;
	
	

	public DataBaseManage() {
		
		/*
		// TODO Auto-generated constructor stub
		sshhostname = TestConfigs.glb_sshhostname;
		sshlogin = TestConfigs.glb_sshlogin;
		sshpassword = TestConfigs.glb_sshpassword;
		SshPort = 22; // remote SSH host port number
		DbRemotePort = Integer.parseInt(TestConfigs.glb_DbPort) ;
		DbBHost =TestConfigs.glb_DbBHost;
		DbUser =TestConfigs.glb_DbUser; // database loging username
		DbPassword = TestConfigs.glb_DbPassword; // database login password
		Localport = Integer.parseInt(TestConfigs.glb_DbPort);
		Dbname = TestConfigs.glb_dbName;
		privatekey ="ssh_bigin_top";

		driverName="org.postgresql.Driver";
		connection_string = "jdbc:postgresql://localhost:"+Localport+'/'+Dbname;
	
		conn = null;
		*/
	}
	
	
	public void OpenSSHSessionWithKey()
	{

		try{

			System.out.println ("Connecting..");
			java.util.Properties config = new java.util.Properties();
			config.put("StrictHostKeyChecking", "no");
			JSch ssh = new JSch();

			System.out.println ("Add private key");

			String container = File.separator+ "Data Files"+File.separator;

			String path = System.getProperty("user.dir")+container+privatekey;
			System.out.println(path);
			ssh.addIdentity(path);
			session = ssh.getSession(sshlogin, sshhostname, SshPort);
			System.out.println ("Sessiongot");
			session.setConfig(config);
			//session.setPassword(sshpassword);
			session.connect();
			System.out.println ("Connected");

		}
		catch(Exception e)
		{

			System.out.println (e.getMessage());
		}
	}



	public void OpenSSHSession() 
	{

		try{
			java.util.Properties config = new java.util.Properties();
			config.put("StrictHostKeyChecking", "no");
			JSch ssh = new JSch();
			session = ssh.getSession(sshlogin, sshhostname, SshPort);
			session.setConfig(config);
			session.setPassword(sshpassword);
			session.connect();
		}
		catch (JSchException e)
		{
			e.printStackTrace();
		}
	}



	public void OpenDBConnection()
	{
		try{
		System.out.println("Forwarding...with "+DbBHost);
		session.setPortForwardingL(Localport, DbBHost, DbRemotePort);
		System.out.println("Forwarded");
		Class.forName(driverName);

		

			System.out.println("ConnectingDB...");
			conn = DriverManager.getConnection(connection_string, DbUser, DbPassword);
			System.out.println("ConnectedDB Completed");
			stmt = conn.createStatement();
		}//end try
		catch (SQLException | JSchException | ClassNotFoundException e) {
			e.printStackTrace();
		}

		

	}//end method
	
	/*
	 * public void ClearServercache(TestConfigs testConfigs) {
	 * //Messages_Notification msg = new Messages_Notification(driver_factory);
	 * 
	 * if(msg.Servercache_msg()!=null) {
	 * 
	 * String pathfolder = "";//"cd ../"+TestConfigs.glb_Serverhomefolder;
	 * //====================================================
	 * System.out.println("Run BE JOB");
	 * 
	 * OpenSSHSessionWithKey(); int index=0; ChannelExec channel; try { channel =
	 * (ChannelExec)session.openChannel("exec"); InputStream in_temp =
	 * channel.getInputStream(); channel.setCommand(pathfolder); channel.connect();
	 * channel.disconnect();
	 * 
	 * 
	 * channel= (ChannelExec)session.openChannel("exec"); in_temp =
	 * channel.getInputStream(); channel.setCommand("er"); channel.connect();
	 * channel.disconnect();
	 * 
	 * session.disconnect(); Thread.sleep(2000); } catch (JSchException |
	 * IOException | InterruptedException e) { // TODO Auto-generated catch block
	 * e.printStackTrace(); }
	 * 
	 * 
	 * 
	 * 
	 * }//end if }//end void
	 */

	public void CloseAllConnect()
	{
		try {
			stmt.close();
			conn.close();
			session.disconnect();
		} 
		catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

}
