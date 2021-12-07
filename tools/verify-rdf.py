from rdflib import Graph
from optparse import OptionParser
import os


def main():

  parser = OptionParser(usage="usage: %prog [options]")
  parser.add_option('-i', '--input-file', action='store', help='The input file containing RDF triples')
  (options, args) = parser.parse_args()
  if not options.input_file:
    parser.print_help();
    exit(1)

  g = Graph()

  if options.input_file.endswith('nt'):
    g.parse(options.input_file, format='nt')
  elif options.input_file.endswith('ttl'):
    g.parse(options.input_file, format='turtle')
  elif options.input_file.endswith('owl'):
    g.parse(options.input_file, format='turtle')
  elif options.input_file.endswith('n3'):
    g.parse(options.input_file, format='n3')


  query_amount_triples = """
SELECT (COUNT(*) as ?amountTriples)
WHERE {
  ?s ?p ?o .
}
"""

  rows = g.query(query_amount_triples)
  for row in rows:
    print("Number of triples: %s" % row)
main()
