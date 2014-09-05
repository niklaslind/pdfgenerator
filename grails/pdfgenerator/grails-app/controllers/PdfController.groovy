import org.apache.commons.io.IOUtils

/**
 * Created by nli on 04/09/14.
 */
class PdfController {

    def about() {
        render "OK"
    }



    def generate() {


        System.out.println(">>>> 1: "+request.getReader().text)
        Runtime rt = Runtime.getRuntime();
        Process p;
        response.addHeader("Content-Disposition", "attachment; filename=a.pdf");
        p = rt.exec("/usr/local/bin/wkhtmltopdf --disallow-local-file-access  - -");


        byte[] content =  IOUtils.toByteArray( request.getInputStream() );
        System.out.println(">>>> 2 "+content)
        IOUtils.write(content, p.outputStream)
        byte[] output = IOUtils.toByteArray(p.getInputStream())
        System.out.println(">>>> 2 "+output)
        IOUtils.write( output, response.outputStream )

        response.contentType = 'application/octet-stream'
        response.setHeader 'Content-disposition', "attachment; filename=a.pdf"
        response.outputStream.flush()

    }

}


