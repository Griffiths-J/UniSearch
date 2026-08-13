Before writing any code, inspect this whole project — the file structure, 
how the results/payment flow currently works, and where the eligibility 
data (student grades, aggregate, matched courses) lives once it's computed.

I want to add a "Download PDF" feature: after a student unlocks their 
result, they should be able to download it as a PDF containing their 
name, university, aggregate, and eligible courses.

Styling: I've decided to hand-code the PDF (e.g. with jsPDF) rather than 
snapshot the HTML — this site's audience often has limited data access, 
so a lighter, text-based PDF matters more than pixel-perfect CSS replication. 
The PDF should include:
- Our logo (embedded as an image)
- Our brand colors (find them in our CSS — likely variables or a 
  consistent palette used across the site)
- A clean, sectioned layout: header, student details, course list, footer

Font: check whether the site uses a custom web font. jsPDF only ships 
with a few built-in fonts by default, so if our typography matters a lot 
to our identity, flag that we may need to embed the actual font file — 
otherwise a close built-in font is fine.

Don't write any code yet. First tell me:

1. Where in the codebase the result data currently exists (which file/
   function/variable holds name, university, aggregate, courses)
2. Where the "unlocked result" is displayed on screen, so we know where 
   a download button would go
3. Our brand colors and logo file location, as found in the codebase
4. Whether we're using a custom font, and your recommendation if so
5. Any risks or edge cases (e.g. empty courses list, payment not yet 
   confirmed)

And check demo.html to see how i want the pdf to be. So the pdf output of the demo is how i want my the pdf to be

Once you've laid that out, we'll agree on the plan together before you 
touch any files.