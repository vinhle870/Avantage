
package ProjectContext.dataReader;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilderFactory;
import java.io.File;


public class EnvInfoReader {



  public Data admin  = new Data();
  public Data dealer = new Data();


  public EnvInfoReader() {
    dataReader();
  }

  private File getEnvInfoFile() {
    return switch (GlobalConfigsReader.EnvName) {
      case "Staging" -> new File(GlobalConfigsReader.getInstance().getEnvInfoUrl() + "Staging_TestData.xml");
      case "PROD" -> new File(GlobalConfigsReader.getInstance().getEnvInfoUrl() + "PROD_TestData.xml");
      default -> null;
    };
  }


  private void dataReader() {
    try {
      File     infoFile = getEnvInfoFile();
      Document doc      = DocumentBuilderFactory.newInstance().newDocumentBuilder().parse(infoFile);
      doc.getDocumentElement().normalize();

      dataHandler(admin, doc.getElementsByTagName("AdminPortal").item(0).getChildNodes());
      dataHandler(dealer, doc.getElementsByTagName("DealerPortal").item(0).getChildNodes());

    } catch (Exception e) {
      //TODO add log
      e.printStackTrace();
    }
  }

  private void dataHandler(Data data, NodeList nodeList) {
    for (int i = 0; i < nodeList.getLength(); i++) {
      Node node = nodeList.item(i);

      if (node.getNodeType() == Node.ELEMENT_NODE) {
        switch (node.getNodeName()) {
          case "Url" -> data.url = node.getTextContent();
          case "Username" -> data.username = node.getTextContent();
          case "Password" -> data.password = node.getTextContent();
        }
      }
    }
  }

  public static class Data {
    public String url;
    public String username;
    public String password;
  }
}
